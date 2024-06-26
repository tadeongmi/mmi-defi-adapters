import { IProtocolAdapter } from '../../types/IProtocolAdapter'
import { GetPositionsInput } from '../../types/adapter'
import { SimplePoolAdapter } from '../adapters/SimplePoolAdapter'

export function AddClaimableRewards({
  rewardAdapterIds,
}: {
  rewardAdapterIds: string[]
}) {
  return function actualDecorator(
    originalMethod: SimplePoolAdapter['getPositions'],
    _context: ClassMethodDecoratorContext,
  ) {
    async function replacementMethod(
      this: IProtocolAdapter,
      input: GetPositionsInput,
    ) {
      const protocolTokens = await originalMethod.call(this, input)

      await Promise.all(
        rewardAdapterIds.map(async (rewardAdapterId) => {
          const rewardAdapter = await this.adaptersController.fetchAdapter(
            this.chainId,
            this.protocolId,
            rewardAdapterId,
          )

          await Promise.all(
            protocolTokens.map(async (protocolToken) => {
              const isSupported = (
                await rewardAdapter.getProtocolTokens()
              ).find((token) => token.address === protocolToken.address)

              if (!isSupported) {
                return
              }

              const [reward] = await rewardAdapter.getPositions({
                ...input,
                protocolTokenAddresses: [protocolToken.address],
              })

              if (reward?.tokens && reward.tokens.length > 0) {
                protocolToken.tokens = [
                  ...(protocolToken.tokens ?? []),
                  ...reward.tokens,
                ]
              }
            }),
          )
        }),
      )

      return protocolTokens
    }

    return replacementMethod
  }
}
