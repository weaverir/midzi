"use client";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    HeadingLevel,
    convertMillimetersToTwip,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle
} from "docx";
import { saveAs } from "file-saver";
import {toast} from "react-hot-toast";

const AdminOrder = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [selectedTab, setSelectedTab] = useState('all'); // State to track the selected tab

    useEffect(() => {
        fetchOrderHistory();
        fetchCompletedOrders();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            const response = await axiosInstance.get('accounts/padmin/orders/');
            setOrderHistory(response.data);
        } catch (error) {
            toast.error(error.response?.data?.error || "خطا در دریافت اطلاعات");
        }
    };

    const fetchCompletedOrders = async () => {
        try {
            const response = await axiosInstance.get('accounts/padmin/orders/completed/');
            setCompletedOrders(response.data);
        } catch (error) {
            console.error('Error fetching completed orders:', error);
        }
    };

    const handleUpdateSentStatus = async (orderId) => {
        try {
            await axiosInstance.put(`accounts/order/${orderId}/update_sent/`, { is_sent: true });
            setOrderHistory(orderHistory.map(order =>
                order.id === orderId ? { ...order, is_sent: true } : order
            ));
            alert('وضعیت سفارش به "ارسال شده" تغییر یافت');
        } catch (error) {
            console.error("Error updating order status:", error);
            alert('خطا در تغییر وضعیت سفارش');
        }
    };
    const generateDocx = async (order) => {
        try {
            const discountedTotal = order.items.reduce((sum, item) => {
                return sum + (item.discounted_price ? item.discounted_price * item.quantity : item.price * item.quantity);
            }, 0);

            const finalTotal = discountedTotal - (order.total_price.shipping_cost || 0);

            const doc = new Document({
                styles: {
                    default: {
                        document: {
                            run: {
                                font: 'Vazir FD-WOL',
                            }
                        }
                    }
                },
                sections: [
                    {
                        properties: {
                            page: {
                                size: {
                                    orientation: "portrait",
                                    width: convertMillimetersToTwip(148),
                                    height: convertMillimetersToTwip(210),
                                },
                                margins: {
                                    top: convertMillimetersToTwip(2), // Further reduce top margin
                                    bottom: convertMillimetersToTwip(2), // Further reduce bottom margin
                                    left: convertMillimetersToTwip(2), // Further reduce left margin
                                    right: convertMillimetersToTwip(2), // Further reduce right margin
                                },
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 24, color: "000000" },
                                    bottom: { style: BorderStyle.SINGLE, size: 24, color: "000000" },
                                    left: { style: BorderStyle.SINGLE, size: 24, color: "000000" },
                                    right: { style: BorderStyle.SINGLE, size: 24, color: "000000" },
                                },
                            },
                            rtl: true, // Set the document to right-to-left
                        },
                        children: [
                            new Paragraph({
                                text: "فروشگاه میدزی",
                                heading: HeadingLevel.HEADING_1,
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                text: "midzi.ir",
                                heading: HeadingLevel.HEADING_1,
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                text: "فاکتور سفارش",
                                heading: HeadingLevel.HEADING_2,
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                text: `نام : ${order.customer_full_name}`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: `شماره موبایل : ${order.customer_phone_number}`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: `شناسه سفارش: ${order.id}`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: `آدرس:${order.address.province} ، ${order.address.address}، ${order.address.post_Code}`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: `تاریخ سفارش: ${new Date(order.created_at).toLocaleDateString('fa-IR')}`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({ text: "" }),
                            new Table({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text:"قیمت کل",
                                                    alignment: AlignmentType.CENTER,
                                                    size:14,
                                                })],
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text:"قیمت تخفیف‌دار",
                                                    alignment: AlignmentType.CENTER,
                                                    size:14,
                                                })],
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text:"قیمت",
                                                    alignment: AlignmentType.CENTER,
                                                    size:14,
                                                })],
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text:"تعداد",
                                                    alignment: AlignmentType.CENTER,
                                                    size:14,
                                                })],
                                                alignment: AlignmentType.CENTER,
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text:"محصول",
                                                    alignment: AlignmentType.CENTER,
                                                    size:14,
                                                })],
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({
                                                    text:"ردیف",
                                                    alignment: AlignmentType.CENTER,
                                                    size:14,
                                                })],
                                            }),
                                        ],
                                    }),
                                    ...order.items.map((item, index) =>
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        text: item.discounted_price ? (item.discounted_price * item.quantity).toLocaleString() : (item.price * item.quantity).toLocaleString(),
                                                        alignment: AlignmentType.CENTER,
                                                        size: 14,
                                                    })],
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        text: (item.discounted_price === item.price) ? '-' : (item.discounted_price * item.quantity).toLocaleString(),
                                                        alignment: AlignmentType.CENTER,
                                                        size: 14,
                                                    })],
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        text: item.price ? item.price.toLocaleString() : '-',
                                                        alignment: AlignmentType.CENTER,
                                                        size: 14,
                                                    })],
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        text: item.quantity.toString(),
                                                        alignment: AlignmentType.CENTER,
                                                        size: 14,
                                                    })],
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        text: item.product_variant,
                                                        alignment: AlignmentType.CENTER,
                                                        size: 12,
                                                    })],
                                                }),
                                                new TableCell({
                                                    children: [new Paragraph({
                                                        text: (index + 1).toString(),
                                                        alignment: AlignmentType.CENTER,
                                                        size: 14,
                                                    })],
                                                }),
                                            ],
                                        })
                                    ),
                                ],
                            }),
                            new Paragraph({ text: "" }),
                            new Paragraph({
                                text: ` سود شما از این خرید: ${order.total_price.customer_savings.toLocaleString()} تومان`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: `قیمت کل: ${order.total_price.total_price.toLocaleString()} تومان`,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: `هزینه پستی: ${order.total_price.delivery.toLocaleString()} تومان `,
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: '',
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: '',
                                alignment: AlignmentType.RIGHT,
                            }),
                            new Paragraph({
                                text: 'امضا',
                                alignment: AlignmentType.RIGHT,
                            })
                        ],
                    },
                ],
            });

            const buffer = await Packer.toBuffer(doc);
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(blob, `order_${order.id}.docx`);
        } catch (error) {
            console.error("Error generating DOCX:", error);
        }
    };
    // Function to filter orders based on the selected tab
    const filteredOrders = orderHistory.filter(order => {
        if (selectedTab === 'sent') {
            return order.is_sent;
        } else if (selectedTab === 'notSent') {
            return !order.is_sent;
        }
        return true; // For 'all' tab
    });

    // Function to generate DOCX for an order
    return (
        <div className="p-4 flex bg-navblue dark:bg-navblueD  flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">تاریخچه سفارشات</h1>
            <div className="mb-4 flex gap-3">
                <button
                    className={`mr-4 py-2 px-4 ${selectedTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md`}
                    onClick={() => setSelectedTab('all')}
                >
                    همه سفارش‌ها
                </button>
                <button
                    className={`mr-4 py-2 px-4 ${selectedTab === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md`}
                    onClick={() => setSelectedTab('sent')}
                >
                    سفارش‌های ارسال شده
                </button>
                <button
                    className={`py-2 px-4 rounded ${selectedTab === 'notSent' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md`}
                    onClick={() => setSelectedTab('notSent')}
                >
                    سفارش‌های ارسال نشده
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {filteredOrders.map((order) => (
                    <li key={order.id}
                        className="p-4 border rounded-lg bg-white dark:bg-bgdark dark:border-gray-600  dark:text-white mb-2">
                        <p><strong>سفارش شماره:</strong> {order.id}</p>
                        <p>نام : {order.customer_full_name}</p>
                        <p>
                            <strong>آدرس:</strong>{order.address.province} ، {order.address.address} ، {order.address.post_Code}
                        </p>
                        <p className={""}>شماره موبایل : {order.customer_phone_number}</p>
                        <p className={`mb-2 ${order.is_sent ? 'text-green-500' : 'text-red-500'}`}>
                            <strong>وضعیت:</strong> {order.is_sent ? 'ارسال شده' : 'ارسال نشده'}</p>
                        <p><strong>وضعیت
                            پرداخت:</strong> {order.payment_status === 'pending' ? 'در انتظار' : order.payment_status === "completed" ? 'تکمیل شده' : order.payment_status}
                        </p>
                        <p><strong>تاریخ سفارش:</strong> {new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">اقلام:</h3>
                            {order.items.map(item => (
                                <div key={item.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-2">
                                    <p><strong>محصول:</strong> {item.product_variant}</p>
                                    <p><strong>تعداد:</strong> {item.quantity}</p>
                                    {item.price === item.discounted_price ?
                                        <p><strong>قیمت:</strong> {item.price.toLocaleString()} تومان</p> :
                                        <>
                                            <p className={"line-through text-red-600"}>
                                                <strong>قیمت:</strong> {item.price.toLocaleString()} تومان</p>
                                            <p className={""}>
                                                <strong>قیمت:</strong> {item.discounted_price.toLocaleString()} تومان
                                            </p>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">قیمت کل:</h3>
                            <p><strong>کل:</strong> {order.total_price.total_price.toLocaleString()} تومان</p>
                            <p><strong>سود مشتری از این خرید :</strong> {order.total_price.customer_savings.toLocaleString()} تومان</p>
                            <p><strong>هزینه پستی:</strong> {order.total_price.delivery.toLocaleString()} تومان</p>
                        </div>
                        <div className="mt-4">
                            {!order.is_sent && (
                                <button
                                    onClick={() => handleUpdateSentStatus(order.id)}
                                    className="py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
                                >
                                    تغییر وضعیت به ارسال شده
                                </button>
                            )}
                        </div>
                        <div className="mt-4">

                            <button
                                onClick={() => generateDocx(order)}
                                className="py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-700"
                            >
                                ایجاد فاکتور
                            </button>
                        </div>
                    </li>
                ))}
            </div>
        </div>
    );
};

export default AdminOrder;
