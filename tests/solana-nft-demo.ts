import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaNftDemo } from "../target/types/solana_nft_demo";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
	findMasterEditionPda,
	findMetadataPda,
	mplTokenMetadata,
	MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";

import {
	TOKEN_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";


describe("solana-nft-demo", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);
	const program = anchor.workspace
		.SolanaNftDemo as Program<SolanaNftDemo>;

	const signer = provider.wallet;
  

  const umi = createUmi("http://127.0.0.1:8899")
		.use(walletAdapterIdentity(signer))
		.use(mplTokenMetadata());

	const mint = anchor.web3.Keypair.generate();

  const buyer = anchor.web3.Keypair.generate();

	// Derive the associated token address account for the mint
	const associatedTokenAccount = await getAssociatedTokenAddress(
		mint.publicKey,
		signer.publicKey
	);

	// derive the metadata account
	let metadataAccount = findMetadataPda(umi, {
		mint: publicKey(mint.publicKey),
	})[0];

	//derive the master edition pda
	let masterEditionAccount = findMasterEditionPda(umi, {
		mint: publicKey(mint.publicKey),
	})[0];

	const metadata = {
		name: "Gojo",
		symbol: "JJK",
		uri: "https://yellow-major-catfish-634.mypinata.cloud/ipfs/QmdjfXJD8MHkE4vXBibGncsT95wB7jvoPJW3DrmpyTUodu",
	};

	it("mints nft!", async () => {
		const tx = await program.methods
			.mintNft(metadata.name, metadata.symbol, metadata.uri)
			.accounts({
				signer: provider.publicKey,
				mint: mint.publicKey,
				associatedTokenAccount,
				metadataAccount,
				masterEditionAccount,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
				tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
				systemProgram: anchor.web3.SystemProgram.programId,
				rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			})
			.signers([mint])
			.rpc({
        skipPreflight : true
      });

		console.log(
			`mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=localnet`
		);
		console.log(
			`minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=localnet`
		);
	});

  it("Sell!", async () => {

    // Testing constants

    const saleAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;
    // Derive the associated token account address for owner & buyer

    const ownerTokenAddress = await anchor.utils.token.associatedAddress({
      mint: mint.publicKey,
      owner: signer.publicKey
    });
    const buyerTokenAddress = await anchor.utils.token.associatedAddress({
      mint: mint.publicKey,
      owner: buyer.publicKey,
    });
    console.log(`Request to sell NFT: ${mint} for ${saleAmount} lamports.`);
    console.log(`Owner's Token Address: ${ownerTokenAddress}`);
    console.log(`Buyer's Token Address: ${buyerTokenAddress}`);

    // Transact with the "sell" function in our on-chain program
    
    await program.methods.sell(
      new anchor.BN(saleAmount)
    )
    .accounts({
      mint: mint.publicKey,
      ownerTokenAccount: ownerTokenAddress,
      ownerAuthority: signer.publicKey,
      buyerTokenAccount: buyerTokenAddress,
      buyerAuthority: buyer.publicKey,
    })
    .signers([buyer])
    .rpc({
      skipPreflight: true
    });
  });

});
