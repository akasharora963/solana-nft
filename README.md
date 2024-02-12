
# SOLANA NFT DEMO



I use Anchor framework in this demo to make the nft smart contract and metaplex for NFT metadata handling which is the trusted standard for NFTs and digital assets on Solana.

| Functions        | Description                                                |
| ------------------ | ---------------------------------------------------------- |
|| 
| `mint_nft` | Mint an NFT to your local wallet using **Anchor**, including metadata using **Metaplex**. |
| `sell` | Sell one of your NFTs to another Solana wallet. Receive SOl from & transfer NFT to buyer. |


In mint_nft , we need to pass context of accounts and metadata components namely name, symbol and token uri as arguments.

In sell, we need to pass context of accounts and sale_lamports which is the sale amount.

## How NFTs Work
![](NftFlow.png)


## Installation

Setup Solana

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```
Add anchor using cargo
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```
Create project
```bash
anchor init solana-nft-demo
```
Packages to add while making contract

```bash
cargo add anchor-lang@0.28.0 --features=init-if-needed
cargo add anchor-spl@0.28.0 --features=metadata
cargo mpl-token-metadata@1.13.2

```

## Deployment

Build the project
```bash
anchor build
```

 Deploy the project
```bash
anchor deploy
```
![Screenshot from 2024-02-11 18-43-40](https://github.com/akasharora963/solana-nft/assets/45670997/5ba5abb4-5e81-47c0-ac38-3b67897127c8)


On testnet it is deployed at [https://explorer.solana.com/address/7m2hmaT7EJVAd8iYkgWFVQ4nBgZ3LJNSZUBxxkbi1imq?cluster=testnet](https://explorer.solana.com/address/7m2hmaT7EJVAd8iYkgWFVQ4nBgZ3LJNSZUBxxkbi1imq?cluster=testnet)

## Metadata Creation

Uploaded image on Pinata 

![](https://yellow-major-catfish-634.mypinata.cloud/ipfs/QmbGENpJgZt8hbHhy3XofuDsgR2kNVE6i2ey3zZEnSGBaL)

All details are mentioned in 
[https://yellow-major-catfish-634.mypinata.cloud/ipfs/QmdjfXJD8MHkE4vXBibGncsT95wB7jvoPJW3DrmpyTUodu](https://yellow-major-catfish-634.mypinata.cloud/ipfs/QmdjfXJD8MHkE4vXBibGncsT95wB7jvoPJW3DrmpyTUodu)

## Tests
Add  Packages using yarn for interacting with metaplex and writing test cases
```bash
yarn add @solana/spl-token @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/umi-signer-wallet-adapters
```
Run Tests
```bash
anchor test
```
