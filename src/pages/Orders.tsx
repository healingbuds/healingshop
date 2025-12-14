import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle2, XCircle, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useShop } from '@/context/ShopContext';
import { EligibilityGate } from '@/components/shop/EligibilityGate';
import { useDrGreenApi } from '@/hooks/useDrGreenApi';
import { useTranslation } from 'react-i18next';

interface Order {
  orderId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  paymentStatus: string;
}

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'DELIVERED':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'PENDING':
    case 'PROCESSING':
      return <Clock className="h-4 w-4" />;
    case 'SHIPPED':
      return <Truck className="h-4 w-4" />;
    case 'CANCELLED':
    case 'FAILED':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'DELIVERED':
    case 'PAID':
      return 'default';
    case 'PENDING':
    case 'PROCESSING':
      return 'secondary';
    case 'CANCELLED':
    case 'FAILED':
      return 'destructive';
    default:
      return 'outline';
  }
};

const Orders = () => {
  const navigate = useNavigate();
  const { drGreenClient } = useShop();
  const { getOrders } = useDrGreenApi();
  const { t } = useTranslation('shop');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!drGreenClient?.drgreen_client_id) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getOrders(drGreenClient.drgreen_client_id);
        if (result.error) {
          setError(result.error);
        } else {
          setOrders(result.data || []);
        }
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [drGreenClient, getOrders]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <EligibilityGate>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Back button */}
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => navigate('/shop')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dispensary
              </Button>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                      <p className="text-muted-foreground">{error}</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Orders Yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't placed any orders yet. Browse our dispensary to find your medicine.
                      </p>
                      <Button onClick={() => navigate('/shop')}>
                        Browse Dispensary
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order, index) => (
                        <motion.div
                          key={order.orderId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-primary">
                                  #{order.orderId.slice(0, 8)}...
                                </span>
                                <Badge variant={getStatusVariant(order.status)}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1">{order.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  €{order.totalAmount.toFixed(2)}
                                </p>
                                <Badge
                                  variant={getStatusVariant(order.paymentStatus)}
                                  className="text-xs"
                                >
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </EligibilityGate>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
