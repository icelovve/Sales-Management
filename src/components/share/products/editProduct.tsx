import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    alpha,
} from '@mui/material';
import { Inventory } from '@mui/icons-material';
import { fetchWithBase } from '@/components/share/unit/fetchWithBase';

interface Product {
    id: number;
    name: string;
    sku: string;
    quantityInStock: number;
    price: number;
}

interface EditProductProps {
    isOpen: boolean;
    onClose: () => void;
    onProductEdited?: () => void;
    product: Product | null;
}

interface ProductForm {
    name: string;
    sku: string;
    quantityInStock: number;
    price: number;
}

interface ProductFormErrors {
    name?: string;
    sku?: string;
    quantityInStock?: string;
    price?: string;
}

const EditProduct: React.FC<EditProductProps> = ({ isOpen, onClose, onProductEdited, product }) => {
    const [formData, setFormData] = useState<ProductForm>({
        name: '',
        sku: '',
        quantityInStock: 0,
        price: 0,
    });
    const [errors, setErrors] = useState<Partial<ProductFormErrors>>({});

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                quantityInStock: product.quantityInStock,
                price: product.price,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantityInStock' || name === 'price' ? Number(value) : value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ProductFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }
        if (!formData.sku.trim()) {
            newErrors.sku = 'SKU is required';
        }
        if (formData.quantityInStock < 0) {
            newErrors.quantityInStock = 'Quantity cannot be negative';
        }
        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm() || !product) return;

        try {
            const res = await fetchWithBase(`/api/product/edit/${product.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to update product');
            }

            setFormData({ name: '', sku: '', quantityInStock: 0, price: 0 });
            setErrors({});
            onClose();
            if (onProductEdited) onProductEdited();
        } catch (error) {
            console.error('Error updating product:', error);
            setErrors({ name: 'Failed to update product. Please try again.' });
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Inventory sx={{ fontSize: 32, color: '#7e57c2', mr: 1 }} />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #7e57c2 0%, #0277bd 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Edit Product
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Update the details of the product in your inventory.
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 4, py: 2 }}>
                <Box
                    sx={{
                        background: 'white',
                        p: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': { borderColor: '#7e57c2' },
                                    '&.Mui-focused fieldset': { borderColor: '#7e57c2' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#7e57c2' },
                            }}
                        />
                        <TextField
                            label="SKU"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.sku}
                            helperText={errors.sku}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': { borderColor: '#7e57c2' },
                                    '&.Mui-focused fieldset': { borderColor: '#7e57c2' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#7e57c2' },
                            }}
                        />
                        <TextField
                            label="Quantity in Stock"
                            name="quantityInStock"
                            type="number"
                            value={formData.quantityInStock}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.quantityInStock}
                            helperText={errors.quantityInStock}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': { borderColor: '#7e57c2' },
                                    '&.Mui-focused fieldset': { borderColor: '#7e57c2' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#7e57c2' },
                            }}
                        />
                        <TextField
                            label="Price ($)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.price}
                            helperText={errors.price}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': { borderColor: '#7e57c2' },
                                    '&.Mui-focused fieldset': { borderColor: '#7e57c2' },
                                },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#7e57c2' },
                            }}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 3 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderColor: '#7e57c2',
                        color: '#7e57c2',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: alpha('#7e57c2', 0.1), borderColor: '#5c6bc0' },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: '#7e57c2',
                        color: 'white',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#5c6bc0' },
                    }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProduct;