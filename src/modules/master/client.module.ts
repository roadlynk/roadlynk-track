import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from '../../controllers/master/client.controller';
import { ClientRepository } from '../../repositories/master/client.repository';
import { Client, ClientSchema } from '../../schemas/master/client.schema';
import { ClientService } from '../../services/master/client.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }])],
  controllers: [ClientController],
  providers: [ClientRepository, ClientService],
  exports: [ClientRepository, ClientService],
})
export class ClientModule {}
