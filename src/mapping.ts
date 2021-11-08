import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent, BaseTokenUriUpdated,
  FoundationAddressUpdated as FoundationAddressUpdatedEvent,
  MemberAdded as MemberAddedEvent,
  MemberRevoked as MemberRevokedEvent,
  Minted as MintedEvent,
  Transfer as TransferEvent
} from "../generated/BlankArt/BlankArt"
import {
  Account,
  Approval,
  ApprovalForAll,
  BaseToken,
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
  member.blankCount = member.blankCount + 1
  member.save()
}

export function handleTransfer(event: TransferEvent): void {
  let newOwner = event.params.to.toString()
  let oldOwner = event.params.from.toString()

  let token = Token.load(event.params.tokenId.toString())
  token.owner = newOwner
  token.save()

  let oldMember = Account.load(oldOwner)
  let oldMemberBlankCount = oldMember.blankCount - 1
  if(oldMemberBlankCount == 0) {
    oldMember.status = 'Revoked'
  }
  oldMember.blankCount = oldMemberBlankCount
  oldMember.save()

  let member = Account.load(newOwner)
  if(member == null) {
    member = new Account(newOwner)
  }
  member.address = event.params.to
  member.status = "Active"
  member.blankCount = member.blankCount + 1
  member.save()
}

export function handleBaseTokenURIUpdated(event: BaseTokenUriUpdated): void {
  let baseToken = BaseToken.load('1')
  if(baseToken == null) {
    baseToken = new BaseToken('1')
  }
  baseToken.baseTokenUri = event.params.baseTokenURI
  baseToken.save()
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
  let baseToken = BaseToken.load('1')
  if(baseToken == null) {
    baseToken = new BaseToken('1')
  }

  baseToken.controller = event.params.foundationAddress
  baseToken.save()
}
