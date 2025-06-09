import React, { useState } from 'react';
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

interface AddProductProps {
   isOpen: boolean;
   onClose: () => void;
   onProductAdded?: () => void;
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

const AddProduct: React.FC<AddProductProps> = ({ isOpen, onClose, onProductAdded }) => {
   const [formData, setFormData] = useState<ProductForm>({
      name: '',
      sku: '',
      quantityInStock: 0,
      price: 0,
   });
   const [errors, setErrors] = useState<ProductFormErrors>({});

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
      if (!validateForm()) return;

      try {
         const res = await fetchWithBase('/api/product/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
         });

         if (!res.ok) {
            throw new Error('Failed to add product');
         }

         setFormData({ name: '', sku: '', quantityInStock: 0, price: 0 });
         setErrors({});
         onClose();
         if (onProductAdded) onProductAdded();
      } catch (error) {
         console.error('Error adding product:', error);
         setErrors({ name: 'Failed to add product. Please try again.' });
      }
   };

   return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
               <Inventory sx={{ fontSize: 32, color: '#5c6bc0', mr: 1 }} />
               <Typography
                  variant="h5"
                  sx={{
                     fontWeight: 700,
                     background: 'linear-gradient(135deg, #5c6bc0 0%, #0277bd 100%)',
                     backgroundClip: 'text',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                  }}
               >
                  Add New Product
               </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
               Fill in the details to add a new product to your inventory.
            </Typography>
         </DialogTitle>
         <DialogContent sx={{ px: 4, py: 2 }}>
            <Box
               sx={{
                  background: 'white',
                  p: 1
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
                           '&:hover fieldset': { borderColor: '#5c6bc0' },
                           '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
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
                           '&:hover fieldset': { borderColor: '#5c6bc0' },
                           '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
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
                           '&:hover fieldset': { borderColor: '#5c6bc0' },
                           '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
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
                           '&:hover fieldset': { borderColor: '#5c6bc0' },
                           '&.Mui-focused fieldset': { borderColor: '#5c6bc0' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#5c6bc0' },
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
                  borderColor: '#5c6bc0',
                  color: '#5c6bc0',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: alpha('#5c6bc0', 0.1), borderColor: '#1976D2' },
               }}
            >
               Cancel
            </Button>
            <Button
               onClick={handleSubmit}
               variant="contained"
               sx={{
                  backgroundColor: '#5c6bc0',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#1976D2' },
               }}
            >
               Add Product
            </Button>
         </DialogActions>
      </Dialog >
   );
};

export default AddProduct;