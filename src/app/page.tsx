'use client';

import {
   Button,
   Container,
   TextField,
   Typography,
   Box,
   Alert,
   Paper,
   InputAdornment,
   IconButton,
   Stack,
   Divider,
   Avatar
} from '@mui/material';
import {
   Visibility,
   VisibilityOff,
   Email,
   Lock,
   Inventory,
   TrendingUp,
   Business,
   Assessment
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithBase } from '@/components/share/unit/fetchWithBase';

export default function Home() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
         const res = await fetchWithBase('/api/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               Email: email,
               Password: password
            }),
         });

         if (res.ok) {
            const data = await res.json();

            if (data.token) {
               localStorage.setItem('authToken', data.token);
            }

            router.push('/dashboard')

         } else {
            const errorData = await res.json();
            setError(errorData.message || 'Login failed. Please try again.');
         }
      } catch (error) {
         console.error('Login error:', error);
         setError('Network error. Please check your connection and try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
   };

   return (
      <Box
         sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
         }}
      >
         <Container maxWidth="md">
            <Paper
               elevation={24}
               sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  display: 'flex',
                  minHeight: 600,
                  backgroundColor: 'white',
               }}
            >
               <Box
                  sx={{
                     flex: 1,
                     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                     display: { xs: 'none', md: 'flex' },
                     flexDirection: 'column',
                     alignItems: 'center',
                     justifyContent: 'center',
                     color: 'white',
                     p: 4,
                     position: 'relative',
                     '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.1)',
                     }
                  }}
               >
                  <Box sx={{ zIndex: 1, textAlign: 'center' }}>
                     <Avatar
                        sx={{
                           width: 80,
                           height: 80,
                           bgcolor: 'rgba(255,255,255,0.2)',
                           mb: 3,
                           mx: 'auto',
                        }}
                     >
                        <Business sx={{ fontSize: 40 }} />
                     </Avatar>

                     <Typography variant="h3" fontWeight="bold" gutterBottom>
                        InventoryPro
                     </Typography>

                     <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                        Smart Inventory & Sales Management
                     </Typography>

                     <Stack spacing={3}>
                        <Box display="flex" alignItems="center" gap={2}>
                           <Inventory sx={{ fontSize: 28 }} />
                           <Box textAlign="left">
                              <Typography variant="body1" fontWeight="medium">
                                 Inventory Tracking
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                 Real-time stock monitoring
                              </Typography>
                           </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                           <TrendingUp sx={{ fontSize: 28 }} />
                           <Box textAlign="left">
                              <Typography variant="body1" fontWeight="medium">
                                 Sales Analytics
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                 Comprehensive sales reports
                              </Typography>
                           </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                           <Assessment sx={{ fontSize: 28 }} />
                           <Box textAlign="left">
                              <Typography variant="body1" fontWeight="medium">
                                 Business Insights
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                 Data-driven decisions
                              </Typography>
                           </Box>
                        </Box>
                     </Stack>
                  </Box>
               </Box>

               <Box
                  sx={{
                     flex: 1,
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'center',
                     p: { xs: 3, sm: 4, md: 5 },
                  }}
               >
                  <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
                     <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, textAlign: 'center' }}>
                        <Avatar
                           sx={{
                              width: 60,
                              height: 60,
                              bgcolor: 'primary.main',
                              mx: 'auto',
                              mb: 2,
                           }}
                        >
                           <Business sx={{ fontSize: 30 }} />
                        </Avatar>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                           InventoryPro
                        </Typography>
                     </Box>

                     <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                           color: '#333',
                           mb: 1,
                           textAlign: { xs: 'center', md: 'left' }
                        }}
                     >
                        Welcome Back
                     </Typography>

                     <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                           mb: 4,
                           textAlign: { xs: 'center', md: 'left' }
                        }}
                     >
                        Sign in to access your inventory dashboard
                     </Typography>

                     {error && (
                        <Alert
                           severity="error"
                           sx={{
                              mb: 3,
                              borderRadius: 2,
                              '& .MuiAlert-icon': {
                                 fontSize: 20
                              }
                           }}
                        >
                           {error}
                        </Alert>
                     )}

                     <Box component="form" onSubmit={handleLogin}>
                        <TextField
                           label="Email Address"
                           type="email"
                           fullWidth
                           margin="normal"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           disabled={loading}
                           InputProps={{
                              startAdornment: (
                                 <InputAdornment position="start">
                                    <Email color="action" />
                                 </InputAdornment>
                              ),
                           }}
                           sx={{
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                 borderRadius: 2,
                                 '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                 },
                              },
                           }}
                        />

                        <TextField
                           label="Password"
                           type={showPassword ? 'text' : 'password'}
                           fullWidth
                           margin="normal"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           disabled={loading}
                           InputProps={{
                              startAdornment: (
                                 <InputAdornment position="start">
                                    <Lock color="action" />
                                 </InputAdornment>
                              ),
                              endAdornment: (
                                 <InputAdornment position="end">
                                    <IconButton
                                       onClick={handleClickShowPassword}
                                       edge="end"
                                       disabled={loading}
                                    >
                                       {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                 </InputAdornment>
                              ),
                           }}
                           sx={{
                              mb: 3,
                              '& .MuiOutlinedInput-root': {
                                 borderRadius: 2,
                                 '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                 },
                              },
                           }}
                        />

                        <Button
                           type="submit"
                           variant="contained"
                           fullWidth
                           disabled={loading}
                           sx={{
                              height: 56,
                              borderRadius: 2,
                              fontSize: '1.1rem',
                              fontWeight: 'bold',
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                              '&:hover': {
                                 background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                                 boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',
                              },
                              '&:disabled': {
                                 background: '#ccc',
                                 boxShadow: 'none',
                              },
                           }}
                        >
                           {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                     </Box>

                     <Divider sx={{ my: 3, opacity: 0.5 }} />

                     <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                     >
                        Secure access to your business management platform
                     </Typography>
                  </Box>
               </Box>
            </Paper>
         </Container>
      </Box>
   );
}