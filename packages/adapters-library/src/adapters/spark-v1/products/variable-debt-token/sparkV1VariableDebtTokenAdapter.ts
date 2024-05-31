import { CacheToFile } from '../../../../core/decorators/cacheToFile'
import {
  AssetType,
  PositionType,
  ProtocolDetails,
} from '../../../../types/adapter'
import { AaveBasePoolAdapter } from '../../../aave-v2/common/aaveBasePoolAdapter'
import { ProtocolDataProvider } from '../../../aave-v2/contracts'

export class SparkV1VariableDebtTokenPoolAdapter extends AaveBasePoolAdapter {
  productId = 'variable-debt-token'

  getProtocolDetails(): ProtocolDetails {
    return {
      protocolId: this.protocolId,
      name: 'Spark VariableDebtToken',
      description: 'Spark defi adapter for variable interest-accruing token',
      siteUrl: 'https://spark.fi/',
      iconUrl: 'https://github.com/marsfoundation/spark-interface/blob/spark/public/favicon.ico',
      positionType: PositionType.Borrow,
      chainId: this.chainId,
      productId: this.productId,
      assetDetails: {
        type: AssetType.StandardErc20,
      },
    }
  }

  @CacheToFile({ fileKey: 'variable-debt-token-v1' })
  async buildMetadata() {
    return super.buildMetadata()
  }

  protected getReserveTokenAddress(
    reserveTokenAddresses: Awaited<
      ReturnType<ProtocolDataProvider['getReserveTokensAddresses']>
    >,
  ): string {
    return reserveTokenAddresses.variableDebtTokenAddress
  }

  protected getReserveTokenRate(
    reserveData: Awaited<ReturnType<ProtocolDataProvider['getReserveData']>>,
  ): bigint {
    return reserveData.variableBorrowRate
  }
}
