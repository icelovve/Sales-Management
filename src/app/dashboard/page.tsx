'use client'

import MainLayout from '@/components/layouts/MainLayout'
import { fetchWithBase } from '@/components/share/unit/fetchWithBase'
import React, { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Fade,
    Slide
} from '@mui/material'
import {
    TrendingUp,
    Today,
    DateRange,
    CalendarMonth,
    ShoppingCart
} from '@mui/icons-material'

export interface ProductSale {
    productId: string
    productName: string
    totalQuantitySold: number
    totalRevenue: number
}

export interface ProductSalesResponse {
    $id: string
    $values: ProductSale[]
}

export default function Page() {
    const [saleToDay, setSaleToDay] = useState(0)
    const [saleToWeek, setSaleToWeek] = useState(0)
    const [saleToMonth, setSaleToMonth] = useState(0)
    const [productSales, setProductSales] = useState<ProductSale[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingProducts, setLoadingProducts] = useState(true)

    useEffect(() => {
        const fetchSale = async () => {
            try {
                setLoading(true)

                const resDay = await fetchWithBase('/api/dashboard/sales/today')
                const dayData = await resDay.json()
                console.log('DAY:', dayData)

                const totalDay = dayData.totalRevenue ?? 0
                console.log('>>> Parsed totalDay:', totalDay)
                setSaleToDay(totalDay)

                const resWeek = await fetchWithBase('/api/dashboard/sales/weekly')
                const weekData = await resWeek.json()
                console.log('WEEK:', weekData)

                const totalWeek = weekData.$values?.[0]?.totalRevenue ?? 0
                console.log('>>> Parsed totalWeek:', totalWeek)
                setSaleToWeek(totalWeek)

                const resMonth = await fetchWithBase('/api/dashboard/sales/monthly')
                const monthData = await resMonth.json()
                console.log('MONTH:', monthData)

                const totalMonth = monthData.$values?.[0]?.totalRevenue ?? 0
                console.log('>>> Parsed totalMonth:', totalMonth)
                setSaleToMonth(totalMonth)

            } catch (error) {
                console.error('Error fetching sales data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSale()
    }, [])

    useEffect(() => {
        const fetchBestProduct = async () => {
            try {
                setLoadingProducts(true)
                const res = await fetchWithBase('/api/dashboard/product/top10')
                const data: ProductSalesResponse = await res.json()
                console.log('TOP 10 PRODUCTS:', data)
                setProductSales(data.$values || [])
            } catch (error) {
                console.error('Error fetching top products:', error)
                setProductSales([])
            } finally {
                setLoadingProducts(false)
            }
        }

        fetchBestProduct()
    }, [])

    const formatCurrency = (amount: number) => {
        return amount === 0
            ? 'No sales data'
            : new Intl.NumberFormat('th-TH', {
                style: 'currency',
                currency: 'THB'
            }).format(amount)
    }

    const salesData = [
        {
            title: "Today's Sale",
            value: saleToDay,
            icon: <Today sx={{ fontSize: 32, color: '#00D4AA' }} />,
            color: '#00D4AA',
            gradient: 'linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(0, 212, 170, 0.05) 100%)'
        },
        {
            title: "This Week's Sale",
            value: saleToWeek,
            icon: <DateRange sx={{ fontSize: 32, color: '#6C5CE7' }} />,
            color: '#6C5CE7',
            gradient: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1) 0%, rgba(108, 92, 231, 0.05) 100%)'
        },
        {
            title: "This Month's Sale",
            value: saleToMonth,
            icon: <CalendarMonth sx={{ fontSize: 32, color: '#74B9FF' }} />,
            color: '#74B9FF',
            gradient: 'linear-gradient(135deg, rgba(116, 185, 255, 0.1) 0%, rgba(116, 185, 255, 0.05) 100%)'
        }
    ]

    if (loading) {
        return (
            <MainLayout>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="60vh"
                    sx={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                    }}
                >
                    <Box textAlign="center">
                        <CircularProgress
                            size={50}
                            thickness={3}
                            sx={{
                                color: '#6C5CE7',
                                mb: 2
                            }}
                        />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                letterSpacing: '0.5px'
                            }}
                        >
                            Loading dashboard...
                        </Typography>
                    </Box>
                </Box>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <Box sx={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                minHeight: '100vh',
                py: 4
            }}>
                <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3 }}>
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {salesData.map((item, index) => (
                            <Box key={index}>
                                <Slide
                                    direction="up"
                                    in
                                    timeout={600 + (index * 200)}
                                    mountOnEnter
                                    unmountOnExit
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            minHeight: 180,
                                            background: '#ffffff',
                                            border: '1px solid rgba(226, 232, 240, 0.8)',
                                            borderRadius: 3,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                                                borderColor: item.color,
                                                '& .icon-container': {
                                                    transform: 'scale(1.1)',
                                                    background: item.color,
                                                    color: '#fff'

                                                },
                                                '& .trend-indicator': {
                                                    opacity: 1
                                                }
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: item.gradient,
                                                zIndex: 0
                                            }}
                                        />

                                        <CardContent
                                            sx={{
                                                p: 4,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                position: 'relative',
                                                zIndex: 1
                                            }}
                                        >
                                            <Box>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    mb={3}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#64748b',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Typography>

                                                    <Box
                                                        className="icon-container"
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: 2,
                                                            background: `${item.color}15`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.3s ease',
                                                            ml: 3,
                                                            '&:hover': {
                                                                color: '#fff'
                                                            }
                                                        }}
                                                    >
                                                        {React.cloneElement(item.icon, {
                                                            sx: {
                                                                fontSize: 24,
                                                                color: item.color,
                                                                transition: 'color 0.3s ease',
                                                                '&:hover': {
                                                                    color: '#fff'
                                                                }
                                                            }
                                                        })}
                                                    </Box>
                                                </Box>

                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: '#1e293b',
                                                        mb: 2,
                                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                                        letterSpacing: '-0.025em'
                                                    }}
                                                >
                                                    {formatCurrency(item.value)}
                                                </Typography>
                                            </Box>

                                            <Box
                                                className="trend-indicator"
                                                display="flex"
                                                alignItems="center"
                                                sx={{ opacity: 0.7, transition: 'opacity 0.3s ease' }}
                                            >
                                                <TrendingUp sx={{
                                                    fontSize: 16,
                                                    mr: 0.5,
                                                    color: item.color
                                                }} />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: item.color,
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    Live data
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Slide>
                            </Box>
                        ))}
                    </Grid>

                    <Fade in timeout={1200}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                background: '#ffffff',
                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    borderColor: '#6C5CE7'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    p: 4,
                                    background: 'linear-gradient(135deg, #667eea 0%, #5c6bc0 100%)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -50,
                                        right: -50,
                                        width: 200,
                                        height: 200,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        filter: 'blur(30px)'
                                    }}
                                />

                                <Box position="relative" zIndex={1}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <TrendingUp sx={{
                                            fontSize: 28,
                                            color: '#ffffff',
                                            mr: 2
                                        }} />
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#ffffff',
                                                letterSpacing: '-0.025em'
                                            }}
                                        >
                                            Top 10 Best Selling Products
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            fontWeight: 400
                                        }}
                                    >
                                        Products ranked by total revenue generated
                                    </Typography>
                                </Box>
                            </Box>

                            <CardContent sx={{ p: 0 }}>
                                {loadingProducts ? (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        py={8}
                                    >
                                        <Box textAlign="center">
                                            <CircularProgress
                                                size={40}
                                                thickness={3}
                                                sx={{ color: '#6C5CE7', mb: 2 }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontWeight: 500 }}
                                            >
                                                Loading products...
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : productSales.length === 0 ? (
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        py={8}
                                    >
                                        <ShoppingCart sx={{
                                            fontSize: 64,
                                            color: '#cbd5e1',
                                            mb: 3
                                        }} />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#64748b',
                                                mb: 1,
                                                fontWeight: 600
                                            }}
                                        >
                                            No product data available
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: '#94a3b8' }}
                                        >
                                            Product sales data will appear here once available
                                        </Typography>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                                                    }}
                                                >
                                                    <TableCell sx={{
                                                        fontWeight: 700,
                                                        py: 3,
                                                        color: '#374151',
                                                        borderBottom: '2px solid #e5e7eb',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        Rank
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontWeight: 700,
                                                        py: 3,
                                                        color: '#374151',
                                                        borderBottom: '2px solid #e5e7eb',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        Product Name
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            fontWeight: 700,
                                                            py: 3,
                                                            color: '#374151',
                                                            borderBottom: '2px solid #e5e7eb',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        Quantity Sold
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{
                                                            fontWeight: 700,
                                                            py: 3,
                                                            color: '#374151',
                                                            borderBottom: '2px solid #e5e7eb',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        Total Revenue
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {productSales.map((product, index) => (
                                                    <TableRow
                                                        key={product.productId}
                                                        sx={{
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                                                transform: 'scale(1.005)'
                                                            },
                                                            '&:last-child td': { border: 0 },
                                                            borderBottom: '1px solid #f1f5f9'
                                                        }}
                                                    >
                                                        <TableCell sx={{ py: 3 }}>
                                                            <Box display="flex" alignItems="center">
                                                                {index === 0 && (
                                                                    <Chip
                                                                        label="#1"
                                                                        size="small"
                                                                        sx={{
                                                                            background: 'linear-gradient(45deg, #FFD700, #FFA000)',
                                                                            color: '#fff',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.75rem',
                                                                            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                                                                        }}
                                                                    />
                                                                )}
                                                                {index === 1 && (
                                                                    <Chip
                                                                        label="#2"
                                                                        size="small"
                                                                        sx={{
                                                                            background: 'linear-gradient(45deg, #C0C0C0, #9E9E9E)',
                                                                            color: '#fff',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.75rem',
                                                                            boxShadow: '0 4px 12px rgba(192, 192, 192, 0.3)'
                                                                        }}
                                                                    />
                                                                )}
                                                                {index === 2 && (
                                                                    <Chip
                                                                        label="#3"
                                                                        size="small"
                                                                        sx={{
                                                                            background: 'linear-gradient(45deg, #CD7F32, #A0522D)',
                                                                            color: '#fff',
                                                                            fontWeight: 700,
                                                                            fontSize: '0.75rem',
                                                                            boxShadow: '0 4px 12px rgba(205, 127, 50, 0.3)'
                                                                        }}
                                                                    />
                                                                )}
                                                                {index > 2 && (
                                                                    <Chip
                                                                        label={`#${index + 1}`}
                                                                        size="small"
                                                                        sx={{
                                                                            background: '#f1f5f9',
                                                                            color: '#64748b',
                                                                            fontWeight: 600,
                                                                            fontSize: '0.75rem',
                                                                            border: '1px solid #e2e8f0'
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell sx={{ py: 3 }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: '#1e293b',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                {product.productName}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ py: 3 }}>
                                                            <Chip
                                                                label={`${product.totalQuantitySold.toLocaleString()} units`}
                                                                size="small"
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                                                                    border: '1px solid #10b981',
                                                                    color: '#065f46',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.75rem'
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ py: 3 }}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    color: index < 3 ?
                                                                        (index === 0 ? '#FFD700' :
                                                                            index === 1 ? '#C0C0C0' : '#CD7F32')
                                                                        : '#6366f1',
                                                                    fontSize: index < 3 ? '1.1rem' : '1rem'
                                                                }}
                                                            >
                                                                {formatCurrency(product.totalRevenue)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Fade>
                </Box>
            </Box>
        </MainLayout>
    )
}