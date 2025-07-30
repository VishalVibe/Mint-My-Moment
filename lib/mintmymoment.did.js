export const idlFactory = ({ IDL }) => {
  const NFTMetadata = IDL.Record({
    title: IDL.Text,
    description: IDL.Text,
    sport: IDL.Text,
    playerName: IDL.Text,
    eventDate: IDL.Text,
    imageUrl: IDL.Text,
    price: IDL.Nat,
  })
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text })
  const NFT = IDL.Record({
    id: IDL.Text,
    title: IDL.Text,
    description: IDL.Text,
    sport: IDL.Text,
    playerName: IDL.Text,
    eventDate: IDL.Text,
    imageUrl: IDL.Text,
    owner: IDL.Principal,
    creator: IDL.Principal,
    price: IDL.Nat,
    createdAt: IDL.Int,
  })
  const Result_1 = IDL.Variant({ ok: IDL.Null, err: IDL.Text })
  return IDL.Service({
    buyNFT: IDL.Func([IDL.Text], [Result_1], []),
    getAllNFTs: IDL.Func([], [IDL.Vec(NFT)], ["query"]),
    getNFT: IDL.Func([IDL.Text], [IDL.Opt(NFT)], ["query"]),
    getTotalNFTs: IDL.Func([], [IDL.Nat], ["query"]),
    getUserNFTs: IDL.Func([IDL.Principal], [IDL.Vec(NFT)], ["query"]),
    mintNFT: IDL.Func([NFTMetadata], [Result], []),
    transferNFT: IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
  })
}
export const init = ({ IDL }) => {
  return []
}
