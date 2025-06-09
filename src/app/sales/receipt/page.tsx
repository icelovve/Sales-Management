'use client';

import { Suspense } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { fetchWithBase } from '@/components/share/unit/fetchWithBase';

interface OrderItem {
    id: string;
    name: string;
    orderId?: string;
    productId: string;
    quantity: number;
    unitPrice: number;
}

interface OrderData {
    id: string;
    customerName: string;
    orderDate: string;
    totalAmount: number;
    items: {
        $values: OrderItem[];
    };
}

interface ApiResponse {
    message: string;
    data: OrderData;
}

function ReceiptContent() {
    const [receipt, setReceipt] = useState<OrderData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const fetchReceipt = useCallback(async () => {
        if (!orderId) {
            setError('Order ID is missing');
            return;
        }
        try {
            const res = await fetchWithBase(`/api/order/${orderId}`);
            const data: ApiResponse = await res.json();
            if (data.data) {
                setReceipt(data.data);
            } else {
                setError('Order not found');
            }
        } catch (error) {
            console.error('Failed to fetch receipt:', error);
            setError('Failed to load receipt');
        }
    }, [orderId]);

    useEffect(() => {
        fetchReceipt();
    }, [orderId, fetchReceipt]);

    useEffect(() => {
        if (!receipt) return;

        const generatePDF = async () => {
            try {
                const pdfDoc = await PDFDocument.create();
                pdfDoc.registerFontkit(fontkit);

                const lineHeight = 20;
                const paddingTop = 40;
                const paddingBottom = 30;

                const fixedLines = 9;
                const totalLines = fixedLines + receipt.items.$values.length;
                const totalHeight = paddingTop + totalLines * lineHeight + paddingBottom;

                const page = pdfDoc.addPage([270, totalHeight]);
                const { height } = page.getSize();

                const fontUrl = '/font/NotoSerifThai_ExtraCondensed-Regular.ttf';
                const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
                const customFont = await pdfDoc.embedFont(fontBytes);

                let y = height - paddingTop;

                page.drawText('RECEIPT', {
                    x: 100,
                    y,
                    size: 20,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight * 1.5;

                page.drawText(`Order ID : ${receipt.id}`, {
                    x: 20,
                    y,
                    size: 12,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight;

                page.drawText('-----------------------------------------------------------------------------', {
                    x: 20,
                    y,
                    size: 12,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight;

                const date = new Date(receipt.orderDate);
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }).format(date);

                const formattedTime = new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                }).format(date);

                page.drawText(`Date: ${formattedDate}`, {
                    x: 20,
                    y,
                    size: 12,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`${formattedTime}`, {
                    x: 190,
                    y,
                    size: 12,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight;

                page.drawText('-----------------------------------------------------------------------------', {
                    x: 20,
                    y,
                    size: 12,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight;

                page.drawText('Name', { x: 20, y, size: 10, font: customFont });
                page.drawText('Qty', { x: 150, y, size: 10, font: customFont });
                page.drawText('Price', { x: 180, y, size: 10, font: customFont });
                page.drawText('Total', { x: 220, y, size: 10, font: customFont });

                y -= lineHeight;

                receipt.items.$values.forEach((item) => {
                    const total = item.quantity * item.unitPrice;
                    page.drawText(item.name, { x: 20, y, size: 10, font: customFont });
                    page.drawText(item.quantity.toString(), { x: 155, y, size: 10, font: customFont });
                    page.drawText(item.unitPrice.toFixed(2), { x: 180, y, size: 10, font: customFont });
                    page.drawText(total.toFixed(2), { x: 220, y, size: 10, font: customFont });
                    y -= lineHeight;
                });

                y -= 10;

                page.drawText('-----------------------------------------------------------------------------', {
                    x: 20,
                    y,
                    size: 12,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight;

                page.drawText('Total Amount', {
                    x: 20,
                    y,
                    size: 14,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                page.drawText(`$${receipt.totalAmount.toFixed(2)}`, {
                    x: 200,
                    y,
                    size: 14,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                y -= 30;

                page.drawText('Thank you for Visiting!', {
                    x: 85,
                    y,
                    size: 10,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (err) {
                console.error('Failed to generate PDF:', err);
                setError('Failed to generate PDF');
            }
        };

        generatePDF();
    }, [receipt]);

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    if (!pdfUrl) {
        return (
            <div className="flex justify-center items-center h-screen">
                Generating receipt PDF...
            </div>
        );
    }

    return (
        <div className="h-screen">
            <iframe src={pdfUrl} width="100%" height="100%" />
        </div>
    );
}

export const dynamic = 'force-dynamic';

export default function ReceiptPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading receipt...</div>}>
            <ReceiptContent />
        </Suspense>
    );
}