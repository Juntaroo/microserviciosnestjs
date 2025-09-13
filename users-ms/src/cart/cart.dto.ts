//servicio para limpiar el carrito

/*import * as cron from 'node-cron';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {
    cron.schedule('0 0 * * *', this.cleanOldCarts.bind(this)); // cada día
  }

  async cleanOldCarts() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    await this.prisma.cart.deleteMany({
      where: {
        createdAt: { lt: threeDaysAgo },
      },
    });
  }
}
*/