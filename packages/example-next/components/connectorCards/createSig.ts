import { _TypedDataEncoder } from 'ethers/lib/utils'

/**
 * Note signature MUST match what the server is generating
 * otherwise we will not be able to verify signatures
 *
 * https://docs.ethers.io/v5/api/utils/hashing/#TypedDataEncoder
 */
export const createLinkWalletSignature = (
  chainId: number,
  signatureType: string,
  // userId: string,
  address: string,
  // nonce: string
) => {
  const userId = '123456'
  const domain = {
    name: 'example.com',
    version: '1',
    chainId,
  }
  const types = {
    body: [
      { name: 'data', type: '_account' },
      { name: 'nonce', type: 'string' },
      { name: 'action', type: 'string' },
    ],
    _account: [
      { name: 'userId', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
  }
  const values = {
    data: {
      userId,
      wallet: address,
    },
    action: signatureType,
    nonce: '123423352',
  }

  return _TypedDataEncoder.getPayload(domain, types, values)
}
