import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @MessagePattern({cmd: 'create_product'} )
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({cmd: 'find_all_products'})
  findAll() {
    return this.productsService.findAll();
  }

  @MessagePattern({cmd: 'find_one_product'} )
  findOne(@Payload() id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({cmd: 'update_product'})
  update(@Payload() payload: { id: number, updateProductDto: UpdateProductDto }) {
    const { id, updateProductDto } = payload;
    return this.productsService.update(id, updateProductDto);
  }

  @MessagePattern({cmd: 'remove_product'})
  remove(@Payload() id: number) {
    return this.productsService.remove(id);
  }
}