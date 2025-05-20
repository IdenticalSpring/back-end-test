import { Module, forwardRef } from '@nestjs/common';
import { PayOSService } from './payos.service';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
    imports: [
        forwardRef(() => WalletModule) 
    ],
    providers: [PayOSService],
    exports: [PayOSService],
})
export class PayOSModule { }
