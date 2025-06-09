'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    Tooltip,
    Chip,
    useTheme,
    useMediaQuery,
    Paper,
    Stack,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    TrendingUp,
    ShoppingCart,
    Settings,
    Business,
    AccountCircle,
    Logout,
    ChevronRight,
    Category,
    Person,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

const drawerWidth = 280;
const miniDrawerWidth = 72;

interface MainLayoutProps {
    children: React.ReactNode;
}

const menuItems = [
    {
        text: 'Dashboard',
        icon: <Dashboard />,
        path: '/dashboard',
        color: '#2196F3',
    },
    {
        text: 'Sales',
        icon: <TrendingUp />,
        path: '/sales',
        color: '#00BCD4',
    },
    {
        text: 'Orders',
        icon: <ShoppingCart />,
        path: '/orders',
        color: '#607d8b',
    },
    {
        text: 'Products',
        icon: <Category />,
        path: '/products',
        color: '#5c6bc0',
    },
];

export default function MainLayout({ children }: MainLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const router = useRouter();
    const pathname = usePathname();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [miniMode, setMiniMode] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userRole, setUserRole] = useState<'Admin' | 'User'>('User');
    const [userName, setUserName] = useState('John Doe');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/');
            return;
        }
        setUserRole('Admin');
        setUserName('Admin User');
    }, [router]);

    const handleDrawerToggle = () => {
        if (isMobile) {
            setMobileOpen(!mobileOpen);
        } else {
            setMiniMode(!miniMode);
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push('/');
        handleMenuClose();
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const isActiveRoute = (path: string) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Section */}
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 64,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                }}
            >
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        mr: miniMode && !isMobile ? 0 : 2,
                    }}
                >
                    <Business />
                </Avatar>
                {(!miniMode || isMobile) && (
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            POS
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Management System
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* User Info */}
            {(!miniMode || isMobile) && (
                <Paper
                    sx={{
                        m: 2,
                        p: 2,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Person />
                        </Avatar>
                        <Box flex={1}>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {userName}
                            </Typography>
                            <Chip
                                label={userRole}
                                size="small"
                                color={userRole === 'Admin' ? 'error' : 'primary'}
                                sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                        </Box>
                    </Stack>
                </Paper>
            )}

            {/* Navigation Menu */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <Tooltip title={miniMode && !isMobile ? item.text : ''} placement="right">
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        mx: 1,
                                        minHeight: 48,
                                        backgroundColor: isActiveRoute(item.path)
                                            ? `${item.color}15`
                                            : 'transparent',
                                        borderLeft: isActiveRoute(item.path)
                                            ? `4px solid ${item.color}`
                                            : '4px solid transparent',
                                        '&:hover': {
                                            backgroundColor: `${item.color}10`,
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: miniMode && !isMobile ? 'auto' : 56,
                                            color: isActiveRoute(item.path) ? item.color : 'text.secondary',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Badge color="error">
                                            {item.icon}
                                        </Badge>
                                    </ListItemIcon>
                                    {(!miniMode || isMobile) && (
                                        <ListItemText
                                            primary={item.text}
                                            sx={{
                                                '& .MuiListItemText-primary': {
                                                    fontWeight: isActiveRoute(item.path) ? 'bold' : 'normal',
                                                    color: isActiveRoute(item.path) ? item.color : 'text.primary',
                                                },
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { lg: `calc(100% - ${(miniMode ? miniDrawerWidth : drawerWidth)}px)` },
                    ml: { lg: `${(miniMode ? miniDrawerWidth : drawerWidth)}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    borderBottom: '1px solid #e2e8f0',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="toggle drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        {miniMode && !isMobile ? <ChevronRight /> : <MenuIcon />}
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        {pathname === '/dashboard' && 'Dashboard'}
                        {pathname === '/sales' && 'Sales Analytics'}
                        {pathname === '/orders' && 'Order Management'}
                        {pathname === '/products' && 'Product Catalog'}
                        {pathname === '/customers' && 'Customer Management'}
                        {pathname === '/suppliers' && 'Supplier Management'}
                        {pathname.startsWith('/admin') && 'Administration'}
                    </Typography>

                    <IconButton
                        color="inherit"
                        onClick={handleMenuClick}
                        sx={{ p: 0 }}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <AccountCircle />
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Navigation */}
            <Box
                component="nav"
                sx={{ width: { lg: miniMode ? miniDrawerWidth : drawerWidth }, flexShrink: { lg: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', lg: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: miniMode ? miniDrawerWidth : drawerWidth,
                            border: 'none',
                            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { lg: `calc(100% - ${(miniMode ? miniDrawerWidth : drawerWidth)}px)` },
                    minHeight: '100vh',
                    pt: 8,
                }}
            >
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}