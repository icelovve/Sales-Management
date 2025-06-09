'use client';
import MainLayout from '@/components/layouts/MainLayout'
import { fetchWithBase } from '@/components/share/unit/fetchWithBase';
import React, { useEffect, useState, useMemo } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Box,
    Chip,
    alpha,
    Container,
    Card,
    IconButton
} from '@mui/material';
import { Receipt, Visibility } from '@mui/icons-material';

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

export interface ApiResponse {
    message: string;
    data: OrderData;
}

export default function Page() {
    const [order, setOrder] = useState<OrderData[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')

    const fetchOrder = async () => {
        const res = await fetchWithBase('/api/order')
        const data = await res.json();
        setOrder(Array.isArray(data.data?.$values) ? data.data.$values : []);
    }

    useEffect(() => {
        fetchOrder();
    }, [])

    console.log("order :", order);


    const filteredAndSortedOrders = useMemo(() => {
        let filtered = order;

        if (searchTerm.trim()) {
            filtered = order.filter(orderItem =>
                orderItem.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered.sort((a, b) => {
            const dateA = new Date(a.orderDate);
            const dateB = new Date(b.orderDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [order, searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    const getStatusColor = (amount: number) => {
        if (amount >= 1000) return '#059669';
        if (amount >= 500) return '#ff9800';
        return '#64748b';
    }

    const getStatusLabel = (amount: number) => {
        if (amount >= 1000) return 'High Value';
        if (amount >= 500) return 'Medium';
        return 'Standard';
    }

    const handleToReceopt = (id: string) => {
        window.open(`/orders/receipt?id=${id}`, '_blank');
    }

    return (
        <MainLayout>
            <Box sx={{ minHeight: '100vh', py: 4 }}>
                <Container maxWidth="xl">
                    {/* Order Table */}
                    <Card
                        sx={{
                            borderRadius: 4,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                            background: 'white',
                            overflow: 'hidden',
                            px: 2
                        }}
                    >
                        <Box sx={{ p: 4, pb: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                                        Customer Orders
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', width: '300px' }}>
                                        {filteredAndSortedOrders.length} of {order.length} orders
                                        {searchTerm && ` matching "${searchTerm}"`}
                                    </Typography>
                                </Box>
                                <Box>
                                    <TextField
                                        id="search-order"
                                        label="Search by Order ID"
                                        variant="outlined"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#f8fafc',
                                                '&:hover': {
                                                    backgroundColor: '#f1f5f9',
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: 'white',
                                                },
                                                '& fieldset': {
                                                    borderColor: '#6b7280',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#4b5563',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#374151',
                                                },
                                            },
                                            '& .MuiInputBase-input': {
                                                color: '#374151',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#6b7280',
                                                '&.Mui-focused': {
                                                    color: '#374151',
                                                },
                                            },
                                        }}
                                    />
                                </Box>

                            </Box>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {['#', 'Order ID', 'Date', 'Total Amount', 'Status', 'Actions'].map((header, index) => (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    alignItems: 'center',
                                                    backgroundColor: '#f8fafc',
                                                    color: '#475569',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    py: 3,
                                                    borderBottom: '1px solid #e2e8f0',
                                                    ...(header === 'Actions' && { textAlign: 'center' }),
                                                }}
                                            >
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAndSortedOrders.length > 0 ? (
                                        filteredAndSortedOrders.map((orderItem, index) => (
                                            <TableRow
                                                key={orderItem.id}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f8fafc',
                                                    },
                                                    transition: 'background-color 0.15s ease-in-out',
                                                    borderBottom: '1px solid #f1f5f9',
                                                }}
                                            >
                                                <TableCell sx={{ color: '#64748b', fontWeight: 500, py: 3 }}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: alpha('#00BCD4', 0.1),
                                                            color: '#00BCD4',
                                                            px: 2,
                                                            py: 0.5,
                                                            borderRadius: 2,
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            fontFamily: 'monospace',
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        #{orderItem.id}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#64748b',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {formatDate(orderItem.orderDate)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: '#059669',
                                                            fontSize: '1.1rem',
                                                        }}
                                                    >
                                                        {formatCurrency(orderItem.totalAmount)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Chip
                                                        label={getStatusLabel(orderItem.totalAmount)}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: alpha(getStatusColor(orderItem.totalAmount), 0.1),
                                                            color: getStatusColor(orderItem.totalAmount),
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            height: 20,
                                                            borderRadius: 1.5,
                                                            width: 'fit-content',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ py: 3, textAlign: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                        <IconButton
                                                            onClick={() => { handleToReceopt(orderItem.id) }}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha('#00BCD4', 0.1),
                                                                color: '#00BCD4',
                                                                '&:hover': {
                                                                    backgroundColor: alpha('#00BCD4', 0.2),
                                                                },
                                                                borderRadius: 2,
                                                                width: 36,
                                                                height: 36,
                                                            }}
                                                        >
                                                            <Visibility sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                sx={{
                                                    textAlign: 'center',
                                                    py: 8,
                                                    color: '#64748b',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                    <Receipt sx={{ fontSize: 48, color: '#cbd5e1' }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#94a3b8' }}>
                                                        {searchTerm ? 'No matching orders found' : 'No orders found'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        {searchTerm
                                                            ? `No orders match the search term "${searchTerm}"`
                                                            : 'Orders will appear here once customers place them'
                                                        }
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Container>
            </Box>
        </MainLayout>
    )
}