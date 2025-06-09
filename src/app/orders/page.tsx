'use client';

import MainLayout from '@/components/layouts/MainLayout'
import { fetchWithBase } from '@/components/share/unit/fetchWithBase';
import { Box, Card, CardContent, CardMedia, Typography, CardActions, Button, IconButton, List, ListItem, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';

interface Product {
   id: number;
   name: string;
   sku: string;
   quantityInStock: number;
   price: number;
}

interface CartItem {
   id: number;
   name: string;
   sku: string;
   price: number;
   quantity: number;
   maxQuantity: number;
}

interface OrderItem {
   productId: string;
   quantity: number;
}

export interface Order {
   customerName: string;
   items: OrderItem[];
}

export default function Page() {
   const [products, setProducts] = useState<Product[]>([]);
   const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

   const addToCart = (product: Product) => {
      setCartItems(prevItems => {
         const existingItem = prevItems.find(item => item.id === product.id);

         if (existingItem) {
            if (existingItem.quantity < existingItem.maxQuantity) {
               return prevItems.map(item =>
                  item.id === product.id
                     ? { ...item, quantity: item.quantity + 1 }
                     : item
               );
            }
            return prevItems;
         } else {
            const newItem: CartItem = {
               id: product.id,
               name: product.name,
               sku: product.sku,
               price: product.price,
               quantity: 1,
               maxQuantity: product.quantityInStock
            };
            return [...prevItems, newItem];
         }
      });
   };

   const updateQuantity = (id: number, newQuantity: number) => {
      if (newQuantity <= 0) {
         removeFromCart(id);
         return;
      }

      setCartItems(prevItems =>
         prevItems.map(item =>
            item.id === id
               ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
               : item
         )
      );
   };

   const removeFromCart = (id: number) => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
   };

   const clearCart = () => {
      setCartItems([]);
   };

   const getTotalPrice = () => {
      return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
   };

   const getTotalItems = () => {
      return cartItems.reduce((total, item) => total + item.quantity, 0);
   };

   const handleSubmit = async () => {
      // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
      if (cartItems.length === 0) {
         alert('Please add items to cart before placing order');
         return;
      }

      try {
         // เตรียมข้อมูลสำหรับส่งคำสั่งซื้อ
         const orderData = {
            customerName: 'Walk-in Customer',
            items: cartItems.map(item => ({
               productId: item.id.toString(),
               quantity: item.quantity
            }))
         };

         console.log('Sending order data:', orderData);

         const res = await fetchWithBase('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
         });

         if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to submit order');
         }

         const result = await res.json();
         console.log('Order submitted successfully:', result);

         const query = new URLSearchParams({ id: result.data.id }).toString();
         window.open(`/orders/receipt?${query}`, '_blank');

         clearCart();
         await fetchProduct();

      } catch (error) {
         console.error('Error submitting order:', error);
         alert('Failed to place order: ' + error);
      }
   };

   return (
      <MainLayout>
         <Box sx={{
            display: 'flex',
            height: '100vh',
         }}>
            <Box sx={{
               flex: 1,
               p: 2,
               overflow: 'auto'
            }}>
               <Grid container spacing={2}>
                  {products.map((product) => (
                     <Box key={product.id}>
                        <Card
                           sx={{
                              height: 350,
                              width: 240,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              border: '2px solid #e0e0e0',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                 transform: 'translateY(-2px)',
                                 boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                                 borderColor: '#607d8b',
                              }
                           }}
                        >
                           <CardMedia
                              sx={{
                                 height: 140,
                                 backgroundColor: '#f9f9f9',
                                 backgroundSize: 'contain',
                                 backgroundRepeat: 'no-repeat',
                                 backgroundPosition: 'center'
                              }}
                              image="/default-image.jpg"
                              title={product.name}
                           />
                           <CardContent sx={{ flexGrow: 1, p: 2 }}>
                              <Typography
                                 gutterBottom
                                 variant="h6"
                                 component="div"
                                 sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    color: '#2c3e50',
                                    mb: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                 }}
                              >
                                 {product.sku}
                              </Typography>
                              <Typography
                                 variant="body2"
                                 sx={{
                                    color: '#34495e',
                                    lineHeight: 1.6,
                                    mb: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    whiteSpace: 'nowrap',
                                 }}
                              >
                                 <strong>{product.name}</strong>
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                 <Typography
                                    variant="body2"
                                    sx={{
                                       color: product.quantityInStock > 10 ? '#27ae60' : '#e74c3c',
                                       fontWeight: 'bold'
                                    }}
                                 >
                                    Stock: {product.quantityInStock}
                                 </Typography>
                                 <Typography
                                    variant="h6"
                                    sx={{
                                       color: '#607d8b',
                                       fontWeight: 'bold'
                                    }}
                                 >
                                    ${product.price}
                                 </Typography>
                              </Box>
                           </CardContent>
                           <CardActions sx={{
                              p: 2, pt: 0, display: 'flex',
                              justifyContent: 'flex-end',
                           }}>
                              <Button
                                 size="small"
                                 variant="outlined"
                                 onClick={() => addToCart(product)}
                                 disabled={product.quantityInStock === 0}
                                 sx={{
                                    mr: 1,
                                    alignItems: 'center',
                                    borderColor: '#607d8b',
                                    color: '#607d8b',
                                    '&:hover': {
                                       backgroundColor: '#607d8b',
                                       color: 'white'
                                    },
                                    '&:disabled': {
                                       borderColor: '#bbb',
                                       color: '#bbb'
                                    }
                                 }}
                              >
                                 <AddShoppingCartIcon />
                              </Button>
                           </CardActions>
                        </Card>
                     </Box>
                  ))}
               </Grid>
            </Box>

            <Box sx={{
               width: 350,
               backgroundColor: '#ffffff',
               borderLeft: '3px solid #ddd',
               boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
               display: 'flex',
               flexDirection: 'column'
            }}>
               <Box sx={{
                  p: 3,
                  borderBottom: '2px solid #f0f0f0',
                  backgroundColor: '#2c3e50',
                  color: 'white'
               }}>
                  <Typography variant="h5" fontWeight="bold" textAlign="center">
                     POS Cart ({getTotalItems()})
                  </Typography>
               </Box>

               <Box sx={{
                  flex: 1,
                  overflow: 'auto',
                  maxHeight: 'calc(100vh - 300px)'
               }}>
                  {cartItems.length === 0 ? (
                     <Box sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#7f8c8d',
                        height: '100%'
                     }}>
                        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
                           Shopping Cart
                        </Typography>
                        <Typography variant="body2" textAlign="center">
                           Select products to add to cart
                        </Typography>
                     </Box>
                  ) : (
                     <List sx={{ p: 1 }}>
                        {cartItems.map((item, index) => (
                           <React.Fragment key={item.id}>
                              <ListItem sx={{
                                 flexDirection: 'column',
                                 alignItems: 'flex-start',
                                 p: 2,
                                 backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                              }}>
                                 <Box sx={{ width: '100%', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                       {item.sku}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                       {item.name}
                                    </Typography>
                                    <Typography variant="body2" color="primary" fontWeight="bold">
                                       ${item.price} each
                                    </Typography>
                                 </Box>

                                 <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    mt: 1
                                 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                       <IconButton
                                          size="small"
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          sx={{
                                             border: '1px solid #ddd',
                                             width: 28,
                                             height: 28
                                          }}
                                       >
                                          <RemoveIcon fontSize="small" />
                                       </IconButton>
                                       <Typography
                                          sx={{
                                             mx: 2,
                                             minWidth: 30,
                                             textAlign: 'center',
                                             fontWeight: 'bold'
                                          }}
                                       >
                                          {item.quantity}
                                       </Typography>
                                       <IconButton
                                          size="small"
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          disabled={item.quantity >= item.maxQuantity}
                                          sx={{
                                             border: '1px solid #ddd',
                                             width: 28,
                                             height: 28
                                          }}
                                       >
                                          <AddIcon fontSize="small" />
                                       </IconButton>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                       <Typography variant="body1" fontWeight="bold" color="primary">
                                          ${(item.price * item.quantity).toFixed(2)}
                                       </Typography>
                                       <IconButton
                                          size="small"
                                          onClick={() => removeFromCart(item.id)}
                                          sx={{ color: '#e74c3c' }}
                                       >
                                          <DeleteIcon fontSize="small" />
                                       </IconButton>
                                    </Box>
                                 </Box>
                              </ListItem>
                              {index < cartItems.length - 1 && <Divider />}
                           </React.Fragment>
                        ))}
                     </List>
                  )}
               </Box>

               <Box sx={{
                  p: 2,
                  borderTop: '2px solid #f0f0f0',
                  backgroundColor: '#ecf0f1'
               }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                     <Typography variant="h6" fontWeight="bold">
                        Total: ${getTotalPrice().toFixed(2)}
                     </Typography>
                     {cartItems.length > 0 && (
                        <Button
                           size="small"
                           variant="outlined"
                           color="error"
                           onClick={clearCart}
                        >
                           Clear Cart
                        </Button>
                     )}
                  </Box>

                  <Button
                     variant="contained"
                     fullWidth
                     size="large"
                     disabled={cartItems.length === 0}
                     onClick={handleSubmit}
                     sx={{
                        backgroundColor: '#27ae60',
                        '&:hover': {
                           backgroundColor: '#219a52'
                        },
                        '&:disabled': {
                           backgroundColor: '#bbb'
                        }
                     }}
                  >
                     Process Payment
                  </Button>
               </Box>
            </Box>
         </Box>
      </MainLayout>
   );
}