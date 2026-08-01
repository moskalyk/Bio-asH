|%
+$  recipients=(list recipient)
+$  recipient 
  $:  swiftcode=@ta
      email=@ta
      name=@t
      amount=@ud
      question=@t
      answer=@t
      account=account
==
+$  account
  $:  id=@t
      name=@t
      bank=@ud
      accountType=accountType
==
+$  accountType
  $%  [%type =bankAccountType]
==
+$  bankAccountType  ?(%debit %credit %loc %stock %debt)
--
