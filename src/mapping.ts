import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  FoundationAddressUpdated as FoundationAddressUpdatedEvent,
  MemberAdded as MemberAddedEvent,
  MemberRevoked as MemberRevokedEvent,
  Minted as MintedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TokenUriUpdated as TokenUriUpdatedEvent,
  Transfer as TransferEvent
} from "../generated/BlankArt/BlankArt"
import {
  Account,
  Approval,
  ApprovalForAll,
  FoundationAddressUpdated,
  OwnershipTransferred,
  Token
} from "../generated/schema"

export function handleMemberAdded(event: MemberAddedEvent): void {
  let memberAddressString = event.params.member.toHexString()

  let member = Account.load(memberAddressString)
  if(member == null) {
    member = new Account(memberAddressString)
  }
  member.address = event.params.member
  member.status = "Active"
  member.save()
}

export function handleMemberRevoked(event: MemberRevokedEvent): void {
  let memberAddressString = event.params.member.toHexString()

  let member = Account.load(memberAddressString)
  if(member !== null) {
    member.address = event.params.member
    member.status = "Revoked"
    member.save()
  }
}

export function handleMinted(event: MintedEvent): void {
  let token = new Token(
    event.params.tokenId.toString()
  )
  let memberAddressString = event.params.member.toHexString()
  token.tokenId = event.params.tokenId
  token.owner = memberAddressString
  token.tokenURI = event.params.tokenURI
  token.save()

  let member = Account.load(memberAddressString)
  if(member == null) {
    member = new Account(memberAddressString)
  }
  member.address = event.params.member
  member.status = "Active"
  member.save()
}

export function handleTransfer(event: TransferEvent): void {
  let newOwner = event.params.to.toString()
  let oldOwner = event.params.from.toString()

  let token = Token.load(event.params.tokenId.toString())
  token.owner = newOwner
  token.save()

  let member = Account.load(newOwner)
  if(member == null) {
    member = new Account(newOwner)
  }
  member.address = event.params.to
  member.status = "Active"
  member.save()
}

export function handleTokenUriUpdated(event: TokenUriUpdatedEvent): void {
  let token = Token.load(event.params.tokenId.toString())
  token.tokenURI = event.params.tokenURI
  token.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId
  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved
  entity.save()
}

export function handleFoundationAddressUpdated(
  event: FoundationAddressUpdatedEvent
): void {
  let entity = new FoundationAddressUpdated(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.foundationAddress = event.params.foundationAddress
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}
