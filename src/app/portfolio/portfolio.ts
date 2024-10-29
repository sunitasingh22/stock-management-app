export interface Portfolio {

    id: number;
    user: {
        id: number;
        username: string;
        email: string;
        password: string;
        createdDate: string;
    };
    stock: {
        id: number;
        symbol: string;
        name: string;
        stockAddedDate: string;
    };
    quantity: number;
    addedAt: string;
    livePrice: number;
    totalValue: number;
}