import {
  GetEventsInput,
  GetPositionsInput,
  MovementsByBlock,
  ProtocolPosition,
  Underlying,
} from '../types/adapter'
import { Helpers } from './helpers'

export abstract class RewardsAdapter {
  helpers: Helpers
  constructor({ helpers }: { helpers: Helpers }) {
    this.helpers = helpers
  }

  abstract getPositionsWithoutRewards({
    userAddress,
    blockNumber,
    protocolTokenAddresses,
  }: GetPositionsInput): Promise<ProtocolPosition[]>
  abstract getRewardPositions({
    userAddress,
    blockNumber,
    protocolTokenAddress,
  }: {
    userAddress: string

    blockNumber?: number

    protocolTokenAddress?: string

    tokenIds?: string[]
  }): Promise<Underlying[]>
  abstract getWithdrawalsWithoutRewards({
    userAddress,
    blockNumber,
    protocolTokenAddresses,
  }: GetPositionsInput): Promise<MovementsByBlock[]>

  abstract getRewardWithdrawals({
    userAddress,
    blockNumber,
    protocolTokenAddresses,
  }: GetPositionsInput): Promise<MovementsByBlock[]>

  async getPositions({
    userAddress,
    blockNumber,
    protocolTokenAddresses,
  }: GetPositionsInput): Promise<ProtocolPosition[]> {
    return this.helpers.getPositionsAndRewards(
      userAddress,
      this.getPositionsWithoutRewards({
        userAddress,
        blockNumber,
        protocolTokenAddresses,
      }),
      this.getRewardPositions,
      blockNumber,
    )
  }

  async getWithdrawals({
    userAddress,
    protocolTokenAddress,
    fromBlock,
    toBlock,
  }: GetEventsInput): Promise<MovementsByBlock[]> {
    return this.helpers.getWithdrawalsAndRewardWithdrawals(
      userAddress,
      protocolTokenAddress,
      fromBlock,
      toBlock,
      this.getWithdrawalsWithoutRewards,
      this.getRewardWithdrawals,
    )
  }
}
