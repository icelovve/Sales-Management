'use client';

import MainLayout from '@/components/layouts/MainLayout';
import { fetchWithBase } from '@/components/share/unit/fetchWithBase';
import {
    Box,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Card,
    Chip,
    IconButton,
    alpha,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import { Edit, Delete, Inventory } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import AddProduct from '@/components/share/products/addProduct';
import EditProduct from './../../components/share/products/editProduct';

interface Product {
    id: number;
    name: string;
    sku: string;
    quantityInStock: number;
    price: number;
}

export default function Page() {
    const [products, setProducts] = useState<Product[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const openPopup = () => setIsPopupOpen(true);
    const openEditPopup = (product: Product) => {
        setProductToEdit(product);
        setIsEditPopupOpen(true);
    };
    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
        setProductToEdit(null);
    };
    const closePopup = () => setIsPopupOpen(false);

    const fetchProduct = async () => {
        try {
            const res = await fetchWithBase('/api/product/');
            if (!res.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await res.json();

            setProducts(Array.isArray(data.data?.$values) ? data.data.$values : []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const getStockColor = (quantity: number) => {
        if (quantity > 10) return '#10B981';
        if (quantity > 0) return '#F59E0B';
        return '#EF4444';
    };

    const getStockLabel = (quantity: number) => {
        if (quantity > 10) return 'In Stock';
        if (quantity > 0) return 'Low Stock';
        return 'Out of Stock';
    };

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (productToDelete === null) return;

        try {
            const res = await fetchWithBase(`/api/product/${productToDelete}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete product');
            }

            await fetchProduct();
        } catch (error) {
            console.error('Error deleting product:', error);
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    return (
        <MainLayout>
            <Box sx={{ minHeight: '100vh', py: 4 }}>
                <Container maxWidth="xl">
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <Inventory sx={{ fontSize: 40, color: '#5c6bc0', mr: 2 }} />
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #5c6bc0 0%, #0277bd 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Product Management
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#64748b',
                                fontSize: '1.1rem',
                                maxWidth: '600px',
                                mx: 'auto',
                            }}
                        >
                            Manage your inventory with ease. Add new products and track your stock levels.
                        </Typography>
                    </Box>

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
                                        Product Inventory
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                        {products.length} products in total
                                    </Typography>
                                </Box>
                                <Button
                                    onClick={openPopup}
                                >
                                    <Chip
                                        label={"add product"}
                                        sx={{
                                            backgroundColor: alpha('#5c6bc0', 0.1),
                                            color: '#5c6bc0',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            px: 1,
                                        }}
                                    />
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {['#', 'Product', 'SKU', 'Stock', 'Price', 'Actions'].map((header, index) => (
                                            <TableCell
                                                key={index}
                                                sx={{
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
                                    {products.length > 0 ? (
                                        products.map((product, index) => (
                                            <TableRow
                                                key={product.id}
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
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#1e293b',
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {product.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Box
                                                        sx={{
                                                            backgroundColor: alpha('#5c6bc0', 0.1),
                                                            color: '#5c6bc0',
                                                            px: 2,
                                                            py: 0.5,
                                                            borderRadius: 2,
                                                            fontWeight: 600,
                                                            fontSize: '0.875rem',
                                                            fontFamily: 'monospace',
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {product.sku}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ py: 3 }}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: '#1e293b',
                                                            }}
                                                        >
                                                            {product.quantityInStock.toLocaleString('en-US')}
                                                        </Typography>
                                                        <Chip
                                                            label={getStockLabel(product.quantityInStock)}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha(getStockColor(product.quantityInStock), 0.1),
                                                                color: getStockColor(product.quantityInStock),
                                                                fontWeight: 600,
                                                                fontSize: '0.75rem',
                                                                height: 20,
                                                                borderRadius: 1.5,
                                                                width: 'fit-content',
                                                            }}
                                                        />
                                                    </Box>
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
                                                        ${product.price.toLocaleString('en-US')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 3, textAlign: 'center' }}>
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                        <IconButton
                                                            onClick={() => openEditPopup(product)}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha('#5c6bc0', 0.1),
                                                                color: '#5c6bc0',
                                                                '&:hover': {
                                                                    backgroundColor: alpha('#5c6bc0', 0.2),
                                                                },
                                                                borderRadius: 2,
                                                                width: 36,
                                                                height: 36,
                                                            }}
                                                        >
                                                            <Edit sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => handleDeleteClick(product.id)}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha('#EF4444', 0.1),
                                                                color: '#EF4444',
                                                                '&:hover': {
                                                                    backgroundColor: alpha('#EF4444', 0.2),
                                                                },
                                                                borderRadius: 2,
                                                                width: 36,
                                                                height: 36,
                                                            }}
                                                        >
                                                            <Delete sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                sx={{
                                                    textAlign: 'center',
                                                    py: 8,
                                                    color: '#64748b',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                    <Inventory sx={{ fontSize: 48, color: '#cbd5e1' }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#94a3b8' }}>
                                                        No products found
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                                        Add your first product to get started
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>

                    <AddProduct
                        isOpen={isPopupOpen}
                        onClose={closePopup}
                        onProductAdded={fetchProduct}
                    />

                    <EditProduct
                        isOpen={isEditPopupOpen}
                        onClose={closeEditPopup}
                        onProductEdited={fetchProduct}
                        product={productToEdit}
                    />

                    <Dialog
                        open={deleteDialogOpen}
                        onClose={handleDeleteCancel}
                        aria-labelledby="delete-confirm-title"
                        aria-describedby="delete-confirm-description"
                    >
                        <DialogTitle id="delete-confirm-title">Confirm Delete</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-confirm-description">
                                Are you sure you want to delete this product? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteCancel} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </MainLayout>
    );
}