VERSION 5.00
Object = "{BEEECC20-4D5F-4F8B-BFDC-5D9B6FBDE09D}#1.0#0"; "vsflex8.ocx"
Object = "{0BA686C6-F7D3-101A-993E-0000C0EF6F5E}#1.0#0"; "THREED32.OCX"
Begin VB.Form frmItemMastReg
   BorderStyle     =   1  '단일 고정
   Caption         =   "품목관리(frmItemMastReg)"
   ClientHeight    =   9750
   ClientLeft      =   45
   ClientTop       =   435
   ClientWidth     =   17745
   BeginProperty Font
      Name            =   "굴림"
      Size            =   9.75
      Charset         =   129
      Weight          =   400
      Underline       =   0   'False
      Italic          =   0   'False
      Strikethrough   =   0   'False
   EndProperty
   ForeColor       =   &H8000000F&
   KeyPreview      =   -1  'True
   LinkTopic       =   "frmItemMastReg"
   LockControls    =   -1  'True
   MaxButton       =   0   'False
   MDIChild        =   -1  'True
   MinButton       =   0   'False
   ScaleHeight     =   9750
   ScaleWidth      =   17745
   Begin VB.CommandButton cmdPriceCorrect
      Caption         =   " 단가   보정"
      Height          =   700
      Left            =   10560
      TabIndex        =   26
      TabStop         =   0   'False
      Top             =   45
      Width           =   840
   End
   Begin VB.Frame Frame2
      Caption         =   "항목표시"
      Height          =   570
      Left            =   10680
      TabIndex        =   21
      Top             =   840
      Width           =   4815
      Begin VB.OptionButton optBarCode
         Caption         =   "바코드관리"
         Height          =   255
         Left            =   3360
         TabIndex        =   25
         Top             =   220
         Width           =   1335
      End
      Begin VB.OptionButton optAmt
         Caption         =   "단가관리"
         Height          =   255
         Left            =   960
         TabIndex        =   24
         Top             =   220
         Width           =   1095
      End
      Begin VB.OptionButton optPred
         Caption         =   "기간관리"
         Height          =   255
         Left            =   2160
         TabIndex        =   23
         Top             =   220
         Width           =   1095
      End
      Begin VB.OptionButton optAll
         Caption         =   "전체"
         Height          =   255
         Left            =   120
         TabIndex        =   22
         Top             =   220
         Value           =   -1  'True
         Width           =   855
      End
   End
   Begin VB.Frame Frame1
      Caption         =   "[적용단가]"
      BeginProperty Font
         Name            =   "굴림"
         Size            =   11.25
         Charset         =   129
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   855
      Left            =   6165
      TabIndex        =   18
      Top             =   570
      Width           =   4380
      Begin VB.Label Label1
         AutoSize        =   -1  'True
         Caption         =   "2 - 품목 마스터 단가 적용할 품목인 경우"
         BeginProperty Font
            Name            =   "굴림"
            Size            =   9.75
            Charset         =   129
            Weight          =   700
            Underline       =   0   'False
            Italic          =   0   'False
            Strikethrough   =   0   'False
         EndProperty
         ForeColor       =   &H00FF0000&
         Height          =   195
         Index           =   2
         Left            =   240
         TabIndex        =   20
         Top             =   525
         Width           =   3915
      End
      Begin VB.Label Label1
         AutoSize        =   -1  'True
         Caption         =   "1 - 거래 단가 적용할 품목인 경우"
         BeginProperty Font
            Name            =   "굴림"
            Size            =   9.75
            Charset         =   129
            Weight          =   700
            Underline       =   0   'False
            Italic          =   0   'False
            Strikethrough   =   0   'False
         EndProperty
         ForeColor       =   &H00FF0000&
         Height          =   195
         Index           =   1
         Left            =   240
         TabIndex        =   19
         Top             =   285
         Width           =   3210
      End
   End
   Begin VB.CommandButton cmdExcel
      Caption         =   "엑셀(F9)"
      Height          =   700
      Left            =   16005
      TabIndex        =   17
      Top             =   45
      Width           =   840
   End
   Begin VB.TextBox txtPurCompany
      BackColor       =   &H00FFFFFF&
      Height          =   420
      IMEMode         =   10  '한글
      Left            =   3855
      TabIndex        =   3
      Top             =   990
      Width           =   2280
   End
   Begin VB.CommandButton cmdIns
      Caption         =   "초기화(INS)"
      Height          =   700
      Left            =   11445
      TabIndex        =   5
      TabStop         =   0   'False
      Top             =   45
      Width           =   840
   End
   Begin VB.CommandButton cmdPrint
      Caption         =   "출력(F8)"
      Height          =   700
      Left            =   15165
      TabIndex        =   8
      Top             =   45
      Width           =   840
   End
   Begin VB.CommandButton cmdPurCompanyInfo
      Caption         =   "구매처조회(F1)"
      Height          =   700
      Left            =   12285
      TabIndex        =   6
      TabStop         =   0   'False
      Top             =   45
      Width           =   1200
   End
   Begin VB.TextBox txtItemName_1
      BackColor       =   &H00FFFFFF&
      Height          =   420
      Left            =   960
      TabIndex        =   2
      Top             =   1005
      Width           =   1905
   End
   Begin VB.CommandButton cmdReg
      Caption         =   "행추가"
      Height          =   510
      Left            =   15645
      TabIndex        =   10
      ToolTipText     =   "F5"
      Top             =   900
      Width           =   1020
   End
   Begin VB.CommandButton cmdDel
      Caption         =   "행삭제"
      Height          =   510
      Left            =   16665
      TabIndex        =   11
      ToolTipText     =   "F7"
      Top             =   900
      Width           =   1020
   End
   Begin VB.CommandButton cmdEsc
      Caption         =   "종료(ESC)"
      Height          =   700
      Left            =   16845
      TabIndex        =   9
      ToolTipText     =   "ESC"
      Top             =   45
      Width           =   840
   End
   Begin VB.CommandButton cmdSave
      Caption         =   "저장(F3)"
      Height          =   700
      Left            =   13485
      TabIndex        =   7
      TabStop         =   0   'False
      ToolTipText     =   "F3"
      Top             =   45
      Width           =   840
   End
   Begin VB.CommandButton cmdSearch
      Caption         =   "검색(F4)"
      Height          =   700
      Left            =   14325
      TabIndex        =   4
      ToolTipText     =   "F4"
      Top             =   45
      Width           =   840
   End
   Begin VB.TextBox txtItemShotName
      BackColor       =   &H00FFFFFF&
      Height          =   420
      Left            =   960
      TabIndex        =   0
      Top             =   570
      Width           =   1905
   End
   Begin VB.TextBox txtItemName
      BackColor       =   &H00FFFFFF&
      Height          =   420
      IMEMode         =   10  '한글
      Left            =   3855
      TabIndex        =   1
      Top             =   570
      Width           =   2280
   End
   Begin Threed.SSPanel SSPanel1
      Height          =   420
      Index           =   2
      Left            =   30
      TabIndex        =   13
      Top             =   570
      Width           =   915
      _Version        =   65536
      _ExtentX        =   1614
      _ExtentY        =   741
      _StockProps     =   15
      Caption         =   "약어"
      ForeColor       =   -2147483630
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851}
         Name            =   "굴림"
         Size            =   9.75
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      BorderWidth     =   0
      BevelOuter      =   1
      RoundedCorners  =   0   'False
      Alignment       =   4
   End
   Begin Threed.SSPanel SSPanel1
      Height          =   420
      Index           =   1
      Left            =   3000
      TabIndex        =   14
      Top             =   570
      Width           =   840
      _Version        =   65536
      _ExtentX        =   1482
      _ExtentY        =   741
      _StockProps     =   15
      Caption         =   "품명"
      ForeColor       =   -2147483630
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851}
         Name            =   "굴림"
         Size            =   9.75
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      BorderWidth     =   0
      BevelOuter      =   1
      RoundedCorners  =   0   'False
      Alignment       =   4
   End
   Begin VSFlex8Ctl.VSFlexGrid fg
      Height          =   7755
      Left            =   10
      TabIndex        =   12
      TabStop         =   0   'False
      Top             =   1500
      Width           =   17735
      _cx             =   31283
      _cy             =   13679
      Appearance      =   1
      BorderStyle     =   1
      Enabled         =   -1  'True
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851}
         Name            =   "굴림"
         Size            =   9.75
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      MousePointer    =   0
      BackColor       =   14737632
      ForeColor       =   -2147483640
      BackColorFixed  =   -2147483638
      ForeColorFixed  =   -2147483630
      BackColorSel    =   -2147483635
      ForeColorSel    =   -2147483634
      BackColorBkg    =   -2147483644
      BackColorAlternate=   14737632
      GridColor       =   -2147483633
      GridColorFixed  =   -2147483632
      TreeColor       =   -2147483632
      FloodColor      =   192
      SheetBorder     =   -2147483642
      FocusRect       =   1
      HighLight       =   1
      AllowSelection  =   -1  'True
      AllowBigSelection=   -1  'True
      AllowUserResizing=   0
      SelectionMode   =   0
      GridLines       =   1
      GridLinesFixed  =   2
      GridLineWidth   =   1
      Rows            =   2
      Cols            =   2
      FixedRows       =   1
      FixedCols       =   1
      RowHeightMin    =   0
      RowHeightMax    =   0
      ColWidthMin     =   0
      ColWidthMax     =   0
      ExtendLastCol   =   0   'False
      FormatString    =   $"frmItemMastReg.frx":0000
      ScrollTrack     =   0   'False
      ScrollBars      =   3
      ScrollTips      =   0   'False
      MergeCells      =   0
      MergeCompare    =   0
      AutoResize      =   -1  'True
      AutoSizeMode    =   0
      AutoSearch      =   0
      AutoSearchDelay =   2
      MultiTotals     =   -1  'True
      SubtotalPosition=   1
      OutlineBar      =   0
      OutlineCol      =   0
      Ellipsis        =   0
      ExplorerBar     =   0
      PicturesOver    =   0   'False
      FillStyle       =   0
      RightToLeft     =   0   'False
      PictureType     =   0
      TabBehavior     =   1
      OwnerDraw       =   0
      Editable        =   0
      ShowComboButton =   1
      WordWrap        =   0   'False
      TextStyle       =   0
      TextStyleFixed  =   0
      OleDragMode     =   0
      OleDropMode     =   0
      DataMode        =   0
      VirtualData     =   -1  'True
      DataMember      =   ""
      ComboSearch     =   3
      AutoSizeMouse   =   -1  'True
      FrozenRows      =   0
      FrozenCols      =   0
      AllowUserFreezing=   0
      BackColorFrozen =   0
      ForeColorFrozen =   0
      WallPaperAlignment=   9
      AccessibleName  =   ""
      AccessibleDescription=   ""
      AccessibleValue =   ""
      AccessibleRole  =   24
   End
   Begin Threed.SSPanel SSPanel1
      Height          =   420
      Index           =   3
      Left            =   30
      TabIndex        =   15
      Top             =   1005
      Width           =   915
      _Version        =   65536
      _ExtentX        =   1614
      _ExtentY        =   741
      _StockProps     =   15
      Caption         =   "검색문자"
      ForeColor       =   -2147483630
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851}
         Name            =   "굴림"
         Size            =   9.75
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      BorderWidth     =   0
      BevelOuter      =   1
      RoundedCorners  =   0   'False
      Alignment       =   4
   End
   Begin Threed.SSPanel SSPanel1
      Height          =   420
      Index           =   0
      Left            =   3000
      TabIndex        =   16
      Top             =   990
      Width           =   840
      _Version        =   65536
      _ExtentX        =   1482
      _ExtentY        =   741
      _StockProps     =   15
      Caption         =   "매입처"
      ForeColor       =   -2147483630
      BeginProperty Font {0BE35203-8F91-11CE-9DE3-00AA004BB851}
         Name            =   "굴림"
         Size            =   9.75
         Charset         =   129
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      BorderWidth     =   0
      BevelOuter      =   1
      RoundedCorners  =   0   'False
      Alignment       =   4
   End
End
Attribute VB_Name = "frmItemMastReg"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Dim arr(14) As Variant
Dim aaRr() As Variant
Dim pItemNo As Variant
Dim i As Integer
Dim iCol As Integer
Dim iRow As Integer
Dim oldValue As Variant
Dim GridOnOff As Variant
Dim sSql As Variant
Dim pComName As Variant
Dim pComCode As Variant
Dim y As Integer
Dim pl As Variant
Dim gHypenLine As Variant

Dim sParam() As Variant
Dim arrCnt As Integer

Private Sub cmdEsc_Click()
    If MsgBox("종료 하시겠습니까?", vbQuestion + vbYesNo, "종료") = vbNo Then
        Exit Sub
    End If
    Set adors = Nothing
    Unload Me
End Sub

Private Sub cmdIns_Click()
    Call fnIns("All")
End Sub

Private Sub cmdPriceCorrect_Click()
    Dim sSql As Variant

    On Error GoTo ERR_RTN

    adocon.BeginTrans

    sSql = ""
    sSql = sSql & " UPDATE ITEM_MAST                                                                                                                                              " & vbCrLf
    sSql = sSql & "    SET COMCODE_COST = CASE WHEN (PRICE + SALES_MARGIN + ((PRICE + SALES_MARGIN) * (COMCODE_MARGIN / 100.0))) < 2000 -- 출고단가                               " & vbCrLf
    sSql = sSql & "                            THEN CASE WHEN COMCODE_MARGIN <> 0                                                                                                 " & vbCrLf
    sSql = sSql & "                                      THEN ROUND((((PRICE + SALES_MARGIN + ((PRICE + SALES_MARGIN) * (COMCODE_MARGIN / 100.0))) / 10.0) + 0.5), 0) * 10.0      " & vbCrLf
    sSql = sSql & "                                      ELSE PRICE                                                                                                               " & vbCrLf
    sSql = sSql & "                                      END                                                                                                                      " & vbCrLf
    sSql = sSql & "                            ELSE CASE WHEN COMCODE_MARGIN <> 0                                                                                                 " & vbCrLf
    sSql = sSql & "                                      THEN ROUND((((PRICE + SALES_MARGIN + ((PRICE + SALES_MARGIN) * (COMCODE_MARGIN / 100.0))) / 100.0) + 0.5), 0) * 100.0    " & vbCrLf
    sSql = sSql & "                                      ELSE PRICE                                                                                                               " & vbCrLf
    sSql = sSql & "                                      END                                                                                                                      " & vbCrLf
    sSql = sSql & "                            END                                                                                                                                " & vbCrLf
    sSql = sSql & "      , SALES_COST   = CASE WHEN (PRICE + SALES_MARGIN + ((PRICE + SALES_MARGIN) * (DC_MARGIN / 100.0))) < 2000      -- 판매단가                               " & vbCrLf
    sSql = sSql & "                            THEN CASE WHEN DC_MARGIN <> 0                                                                                                      " & vbCrLf
    sSql = sSql & "                                      THEN ROUND((((PRICE + SALES_MARGIN + ((PRICE + SALES_MARGIN) * (DC_MARGIN / 100.0))) / 10.0) + 0.5), 0) * 10.0           " & vbCrLf
    sSql = sSql & "                                      ELSE PRICE                                                                                                               " & vbCrLf
    sSql = sSql & "                                      END                                                                                                                      " & vbCrLf
    sSql = sSql & "                            ELSE CASE WHEN DC_MARGIN <> 0                                                                                                      " & vbCrLf
    sSql = sSql & "                                      THEN ROUND((((PRICE + SALES_MARGIN + ((PRICE + SALES_MARGIN) * (DC_MARGIN / 100.0))) / 100.0) + 0.5), 0) * 100.0         " & vbCrLf
    sSql = sSql & "                                      ELSE PRICE                                                                                                               " & vbCrLf
    sSql = sSql & "                                      END                                                                                                                      " & vbCrLf
    sSql = sSql & "                            END                                                                                                                                " & vbCrLf
    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    adocon.CommitTrans

    Exit Sub

ERR_RTN:
    adocon.RollbackTrans
    MsgBox Err.Description
End Sub

Private Sub cmdPurCompanyInfo_Click()
    Call fnPurCompanyInfo
End Sub

Private Sub cmdReg_Click()
    fg.FixedCols = 1
    fg.AddItem "N", fg.Row + 1
    fg.TextMatrix(fg.Row + 1, 10) = "SEL"
    fg.TextMatrix(fg.Row + 1, 12) = "Y"
    fg.TextMatrix(fg.Row + 1, 13) = "1"
    fg.TextMatrix(fg.Row + 1, 14) = "N"
    Call fnEditCell(fg.Row + 1, 2)
End Sub

Private Sub cmdSave_Click()
    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" And UCase(Trim(sLoginGbn)) <> "USER4" Then
        MsgBox "권한이 없습니다."
        Exit Sub
    End If

    If MsgBox("저장 하시겠습니까?", vbQuestion + vbYesNo, "종료") = vbYes Then
        If fnDataChk = False Then Exit Sub
        If fntrans = True Then
           '2007.07.15 품목등록후 오류 발생 - 초기화
           Call fnIns("All")
        End If
    End If
End Sub

Private Function fnDataChk()
    Dim j As Integer
    Dim sRowData As Variant
    Dim k As Integer
    Dim errMsg As Variant

    ReDim sParam(0)
    ReDim sRowData(fg.Cols - 1)

    fnDataChk = ""
    k = 0

    For i = 1 To fg.Rows - 1
        If (fg.TextMatrix(i, 0) = "N" Or fg.TextMatrix(i, 0) = "U") And fg.TextMatrix(i, 2) <> "" Then
            If fg.TextMatrix(i, 3) = "" Then
                errMsg = "약어는 입력 필수 항목 입니다."
                iCol = 3
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 4) = "" Then
                errMsg = "단위는 입력 필수 항목 입니다."
                iCol = 4
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 5) = "" Then
                errMsg = "BOX수량은 입력 필수 항목 입니다."
                iCol = 5
                GoTo ERR_RTN
            ElseIf IsNumeric(fg.TextMatrix(i, 5)) = False Then
                errMsg = "수량은 숫자 이어야 합니다."
                iCol = 5
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 4) = gBoxUnit And CInt(fg.TextMatrix(i, 5)) <= 0 Then
                errMsg = "BOX수량은 1이상 이어야 합니다."
                iCol = 5
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 6) = "" Then
                errMsg = "구매단가는 입력 필수 항목 입니다."
                iCol = 6
                GoTo ERR_RTN
            ElseIf IsNumeric(fg.TextMatrix(i, 6)) = False Then
                errMsg = "구매단가 숫자 이어야 합니다."
                iCol = 6
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 7) = "" Then
                errMsg = "출고단가 입력 필수 항목 입니다."
                iCol = 7
                GoTo ERR_RTN
            ElseIf IsNumeric(fg.TextMatrix(i, 7)) = False Then
                errMsg = "출고단가는 숫자 이어야 합니다."
                iCol = 7
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 8) = "" Then
                errMsg = "판매단가는 입력 필수 항목 입니다."
                iCol = 8
                GoTo ERR_RTN
            ElseIf IsNumeric(fg.TextMatrix(i, 8)) = False Then
                errMsg = "판매단가 숫자 이어야 합니다."
                iCol = 8
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 9) = "" Then
                fg.TextMatrix(i, 11) = ""
                errMsg = "구매처는 입력 필수 항목 입니다."
                iCol = 9
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 9) <> "" And fg.TextMatrix(i, 11) = "" Then
                errMsg = "등록되지 않은 거래처 입니다."
                iCol = 9
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 12) <> "" And fg.TextMatrix(i, 12) <> "Y" And fg.TextMatrix(i, 12) <> "N" Then
                errMsg = "과세여부는 Y,N만 가능 합니다."
                iCol = 12
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 13) <> "" And fg.TextMatrix(i, 13) <> "1" And fg.TextMatrix(i, 13) <> "2" Then
                errMsg = "적용단가는 1,2만 가능 합니다."
                iCol = 13
                GoTo ERR_RTN
            ElseIf Len(fg.TextMatrix(i, 15)) > 50 Then
                errMsg = "별칭 최대입력길이는 50자 입니다."
                iCol = 15
                GoTo ERR_RTN

            ElseIf IsNumeric(fg.TextMatrix(i, 16)) = False Then
                errMsg = "재고기간은 숫자 이어야 합니다."
                iCol = 16
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 16) <> "" And CInt(fg.TextMatrix(i, 16)) >= 1000 Then
                errMsg = "재고기간 최대값은 '999' 이어야 합니다."
                iCol = 16
                GoTo ERR_RTN

            ElseIf IsNumeric(fg.TextMatrix(i, 17)) = False Then
                errMsg = "발주기간은 숫자 이어야 합니다."
                iCol = 17
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 17) <> "" And CInt(fg.TextMatrix(i, 17)) >= 1000 Then
                errMsg = "발주기간 최대값은 '999' 이어야 합니다."
                iCol = 17
                GoTo ERR_RTN

            ElseIf IsNumeric(fg.TextMatrix(i, 18)) = False Then
                errMsg = "매입기간은 숫자 이어야 합니다."
                iCol = 18
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 18) <> "" And CInt(fg.TextMatrix(i, 18)) >= 1000 Then
                errMsg = "매입기간 최대값은 '999' 이어야 합니다."
                iCol = 18
                GoTo ERR_RTN

            ElseIf IsNumeric(fg.TextMatrix(i, 19)) = False Then
                errMsg = "유통기한은 숫자 이어야 합니다."
                iCol = 19
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 19) <> "" And CInt(fg.TextMatrix(i, 19)) >= 10000 Then
                errMsg = "유통기한 최대값은 '9999' 이어야 합니다."
                iCol = 19
                GoTo ERR_RTN

            ElseIf IsNumeric(fg.TextMatrix(i, 20)) = False Then
                errMsg = "출고마진은 숫자 이어야 합니다."
                iCol = 20
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 20) <> "" And CDbl(fg.TextMatrix(i, 20)) >= 1000# Then
                errMsg = "출고마진 최대값은 '999' 이어야 합니다."
                iCol = 20
                GoTo ERR_RTN

'''            ElseIf IsNumeric(fg.TextMatrix(i, 21)) = False Then
'''                errMsg = "할인마진은 숫자 이어야 합니다."
'''                iCol = 21
'''                GoTo ERR_RTN
'''            ElseIf fg.TextMatrix(i, 21) <> "" And CDbl(fg.TextMatrix(i, 21)) >= 1000# Then
'''                errMsg = "할인마진 최대값은 '999' 이어야 합니다."
'''                iCol = 21
'''                GoTo ERR_RTN

            ElseIf IsNumeric(fg.TextMatrix(i, 21)) = False Then
                errMsg = "판매마진은 숫자 이어야 합니다."
                iCol = 21
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 21) <> "" And CDbl(fg.TextMatrix(i, 21)) >= 1000# Then
                errMsg = "판매마진 최대값은 '999' 이어야 합니다."
                iCol = 21
                GoTo ERR_RTN

'''            ElseIf IsNumeric(fg.TextMatrix(i, 22)) = False Then
'''                errMsg = "판매마진은 숫자 이어야 합니다."
'''                iCol = 22
'''                GoTo ERR_RTN
'''            ElseIf fg.TextMatrix(i, 22) <> "" And CDbl(fg.TextMatrix(i, 22)) >= 1000# Then
'''                errMsg = "판매마진 최대값은 '999' 이어야 합니다."
'''                iCol = 22
'''                GoTo ERR_RTN

            ElseIf IsNumeric(fg.TextMatrix(i, 22)) = False Then
                errMsg = "원가마진은 숫자 이어야 합니다."
                iCol = 22
                GoTo ERR_RTN
            ElseIf fg.TextMatrix(i, 22) <> "" And CDbl(fg.TextMatrix(i, 22)) > 100000# Then
                errMsg = "원가마진 최대값은 '100000' 이어야 합니다."
                iCol = 22
                GoTo ERR_RTN

            ElseIf Len(fg.TextMatrix(i, 23)) > 20 Then
                errMsg = "품목그룹명 최대입력길이는 20자 입니다."
                iCol = 23
                GoTo ERR_RTN

            ElseIf Len(fg.TextMatrix(i, 25)) > 14 Then
                errMsg = "바코드 최대입력길이는 14Byte 입니다."
                iCol = 25
                GoTo ERR_RTN

            End If

            k = k + 1
            ReDim Preserve sParam(k)

            For j = 0 To fg.Cols - 1
                sRowData(j) = Replace(Replace(fg.TextMatrix(i, j), "'", ""), ",", "")
            Next

            sParam(k) = sRowData
        End If
    Next

    If k = 0 Then
        fnDataChk = "저장할 데이터가 없습니다."
    End If

    Exit Function

ERR_RTN:
    MsgBox errMsg
    fnDataChk = False
    fg.Select i, iCol
    fg.EditCell

End Function

Private Function fntrans()
    Dim sItemNo As Variant
    Dim sqlFlag As Variant

    On Error GoTo ERR_RTN

    fntrans = True

    adocon.BeginTrans

    For i = 1 To UBound(sParam, 1)
        If sParam(i)(2) <> "" Then

            If sParam(i)(0) = "N" Then

                Call fnGetItemSelect
                Set adors = New ADODB.Recordset
                adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

                Call fnGetItemNo(adors, sItemNo)
                sParam(i)(1) = sItemNo

                Call fnItemInsert(i)
                Set adors = New ADODB.Recordset
                adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

            ElseIf sParam(i)(0) = "U" Then

                Call fnItemUpdate(i)
                Set adors = New ADODB.Recordset
                adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

                Call fnCompanyItemUpdate(i)
                Set adors = New ADODB.Recordset
                adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

                Call fnSalesOrderDetUpdate(i)
                Set adors = New ADODB.Recordset
                adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

            End If

        End If

    Next

    adocon.CommitTrans

    Exit Function

ERR_RTN:
    adocon.RollbackTrans
    MsgBox Err.Description
    fntrans = False

End Function

Private Function fnGetItemNo(ByVal adors As Object, ByRef sItemNo As Variant)
     If IsNumeric(adors(0)) = False Then
        If Len(CStr(Val(Mid(adors(0), 2, 5)) + 1)) = 1 Then
            sItemNo = "Z0000" & CStr(Val(Mid(adors(0), 2, 5)) + 1)
        ElseIf Len(CStr(Val(Mid(adors(0), 2, 5)) + 1)) = 2 Then
            sItemNo = "Z000" & CStr(Val(Mid(adors(0), 2, 6)) + 1)
        ElseIf Len(CStr(Val(Mid(adors(0), 2, 5)) + 1)) = 3 Then
            sItemNo = "Z00" & CStr(Val(Mid(adors(0), 2, 6)) + 1)
        ElseIf Len(CStr(Val(Mid(adors(0), 2, 5)) + 1)) = 4 Then
            sItemNo = "Z0" & CStr(Val(Mid(adors(0), 2, 5)) + 1)
        End If
     Else
        If Len(CStr(Val(adors(0)) + 1)) = 1 Then
            sItemNo = "00000" & CStr(Val(adors(0)) + 1)
        ElseIf Len(CStr(Val(adors(0)) + 1)) = 2 Then
            sItemNo = "0000" & CStr(Val(adors(0)) + 1)
        ElseIf Len(CStr(Val(adors(0)) + 1)) = 3 Then
            sItemNo = "000" & CStr(Val(adors(0)) + 1)
        ElseIf Len(CStr(Val(adors(0)) + 1)) = 4 Then
            sItemNo = "00" & CStr(Val(adors(0)) + 1)
        ElseIf Len(CStr(Val(adors(0)) + 1)) = 5 Then
            sItemNo = "0" & CStr(Val(adors(0)) + 1)
        ElseIf Len(CStr(Val(adors(0)) + 1)) = 6 Then
            sItemNo = CStr(Val(adors(0)) + 1)
        End If
    End If
End Function

Private Sub cmdDel_Click()
    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" Then
        MsgBox "권한이 없습니다."
        Exit Sub
    End If
    Call fnDel
End Sub

Private Function fnDel()
    Dim errMsg As Variant
    Dim rsData As Object

    fnDel = True
    If fg.Row < 1 Then
        fnDel = False
        Exit Function
    End If

    If MsgBox("삭제 하시겠습니까?", vbQuestion + vbYesNo, "종료") = vbNo Then
        fg.Select fg.Row, 2
        fg.EditCell
        Exit Function
    End If

    If fg.TextMatrix(fg.Row, 0) = "N" Then
        fg.RemoveItem (fg.Row)
        Exit Function
    End If

    adocon.BeginTrans

    Call fnItemMastDelete
    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    Call fnCompanyItemChk
    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    If adors(0) > 0 Then
        If MsgBox("거래처별 가격 데이터가 존재 합니다. 삭제 하시겠습니까?", vbQuestion + vbYesNo, "종료") = vbNo Then
            errMsg = "삭제가 취소 되었습니다."
            GoTo ERR_RTN
        End If
    End If

    Call fnCompanyItemDelete
    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    Call fnSalesOrderChk
    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    If adors.RecordCount > 0 Then
        If MsgBox("거래 데이터가 존재 합니다. 삭제 하시겠습니까?", vbQuestion + vbYesNo, "종료") = vbNo Then
            errMsg = "삭제가 취소 되었습니다."
            GoTo ERR_RTN
        Else
            Set rsData = adors
            Do While Not rsData.EOF
                Call fnSalesOrderMastDelete(rsData)
                Set adors = New ADODB.Recordset
                adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly
                rsData.MoveNext
            Loop
        End If
    End If

    Call fnSalesOrderDetDelete
    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    fg.RemoveItem (fg.Row)

    adocon.CommitTrans

    Exit Function

ERR_RTN:
    adocon.RollbackTrans
    MsgBox errMsg
    fnDel = False
    Exit Function

err_handler:
    errMsg = Err.Description
    GoTo ERR_RTN

End Function

Private Sub cmdSearch_Click()

    Call fnItemSelect

End Sub

Private Function fnItemSelect()
    Dim sSql As Variant
    Dim errMsg As Variant

    On Error GoTo err_handler

    fnItemSelect = False

    '                      1      2    3     4      5        6        7         8        9      10     11     12    13    14    15      16        17        18        19        20        21        22         23        24       25      26
    'fg.FormatString = "<|^코드|<품명|<약어|^단위|>B수량|>구매단가|>출고단가|>판매단가|<구매처|<위치|<CustCd|^과세|^적용|^사용|<별칭|>재고기간|>발주기간|>매입기간|>유통기한|>출고마진|>판매마진|>원가마진|<품목그룹명|>현재고|<바코드|<최종매입일자"

    sSql = ""
    sSql = sSql & " SELECT '' TRANS, " & vbCrLf
    sSql = sSql & "        A.ITEM_NO, " & vbCrLf
    sSql = sSql & "        A.ITEM_NAME, " & vbCrLf
    sSql = sSql & "        A.ITEM_SHOT_NAME, " & vbCrLf
    sSql = sSql & "        A.UNIT_CD, " & vbCrLf
    sSql = sSql & "        A.BOX_QTY, " & vbCrLf
    sSql = sSql & "        A.PRICE, " & vbCrLf
    sSql = sSql & "        A.COMCODE_COST, " & vbCrLf
    sSql = sSql & "        A.SALES_COST, " & vbCrLf
    sSql = sSql & "        B.COMNAME, " & vbCrLf
    sSql = sSql & "        CASE WHEN A.ITEM_LOCATION = '' " & vbCrLf
    sSql = sSql & "             THEN 'SEL' " & vbCrLf
    sSql = sSql & "             ELSE ISNULL(A.ITEM_LOCATION,'SEL') " & vbCrLf
    sSql = sSql & "             END ITEM_LOCATION, " & vbCrLf
    sSql = sSql & "        ISNULL(B.COMCODE,'') COMCODE," & vbCrLf
    sSql = sSql & "        ISNULL(A.TAX_YN,'N') TAX_YN, " & vbCrLf
    sSql = sSql & "        ISNULL(A.COST_GBN,'1') COST_GBN, " & vbCrLf
    sSql = sSql & "        ISNULL(A.STOP_YN,'N') STOP_YN, " & vbCrLf
    sSql = sSql & "        ISNULL(A.ITEM_NICK_NM,'') ITEM_NICK_NM, " & vbCrLf
    sSql = sSql & "        ISNULL(A.STOCK_TERM_DAYS,'0') STOCK_TERM_DAYS, " & vbCrLf
    sSql = sSql & "        ISNULL(A.PUR_TERM_DAYS,'0') PUR_TERM_DAYS, " & vbCrLf
    sSql = sSql & "        ISNULL(A.ORD_TERM_DAYS,'0') ORD_TERM_DAYS, " & vbCrLf
    sSql = sSql & "        ISNULL(A.EXPIR_DAYS,'0') EXPIR_DAYS, " & vbCrLf
    sSql = sSql & "        ISNULL(A.COMCODE_MARGIN,'0.0') COMCODE_MARGIN, " & vbCrLf
    sSql = sSql & "        ISNULL(A.DC_MARGIN,'0.0') DC_MARGIN, " & vbCrLf
    sSql = sSql & "        ISNULL(A.SALES_MARGIN,'0.0') SALES_MARGIN, " & vbCrLf
    sSql = sSql & "        ISNULL(A.ITEM_GRP_NM,'') ITEM_GRP_NM, " & vbCrLf

    sSql = sSql & "        ISNULL(CASE WHEN A.STOCK_YN = 'Y' " & vbCrLf
    sSql = sSql & "                    THEN ( " & vbCrLf
    sSql = sSql & "                         SELECT CASE WHEN X.INV_QTY = 0 THEN NULL ELSE X.INV_QTY END " & vbCrLf
    sSql = sSql & "                           FROM ITEM_STOCK X, " & vbCrLf
    sSql = sSql & "                                ( " & vbCrLf
    sSql = sSql & "                                 SELECT MAX(TRANS_DATE) TRANS_DATE " & vbCrLf
    sSql = sSql & "                                   FROM ITEM_STOCK Y " & vbCrLf
    sSql = sSql & "                                  WHERE Y.ITEM_NO = A.ITEM_NO " & vbCrLf
    sSql = sSql & "                                ) X1 " & vbCrLf
    sSql = sSql & "                          WHERE X1.TRANS_DATE = X.TRANS_DATE " & vbCrLf
    sSql = sSql & "                            AND X.ITEM_NO = A.ITEM_NO " & vbCrLf
    sSql = sSql & "                        ) " & vbCrLf
    sSql = sSql & "              END ,NULL) AS INV_QTY, " & vbCrLf

    sSql = sSql & "        ISNULL(A.BARCODE,'') BARCODE, " & vbCrLf
    sSql = sSql & "        dbo.DateFormat10(ISNULL(A.OK_DATE,''),'') OK_DATE " & vbCrLf

    sSql = sSql & "   FROM ITEM_MAST A, COMPANY_MAST B " & vbCrLf
    sSql = sSql & "  WHERE 1 = 1" & vbCrLf
    If txtItemName <> "" Then
        sSql = sSql & "    AND A.ITEM_NAME LIKE '" & txtItemName & "%' " & vbCrLf
        sSql = sSql & "    AND A.COMCODE *= B.COMCODE " & vbCrLf
    ElseIf txtItemShotName <> "" Then
        sSql = sSql & "    AND A.ITEM_SHOT_NAME = '" & txtItemShotName & "' " & vbCrLf
        sSql = sSql & "    AND A.COMCODE *= B.COMCODE " & vbCrLf
    ElseIf txtItemName_1 <> "" Then
        sSql = sSql & "    AND A.ITEM_NAME LIKE '%" & txtItemName_1 & "%' " & vbCrLf
        sSql = sSql & "    AND A.COMCODE *= B.COMCODE " & vbCrLf
    ElseIf txtPurCompany <> "" Then
        sSql = sSql & "    AND B.COMNAME LIKE '" & txtPurCompany & "%' " & vbCrLf
        sSql = sSql & "    AND A.COMCODE = B.COMCODE " & vbCrLf
    Else
        sSql = sSql & "    AND A.ITEM_NAME LIKE '%' " & vbCrLf
        sSql = sSql & "    AND A.COMCODE *= B.COMCODE " & vbCrLf
    End If
    '''sSql = sSql & "  ORDER BY A.STOP_YN ASC, A.ITEM_NICK_NM ASC " & vbCrLf
    sSql = sSql & "  ORDER BY A.STOP_YN ASC, A.ITEM_NAME ASC " & vbCrLf

    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    If adors.RecordCount = 0 Then
        errMsg = "찾고자 하는 자료가 없습니다."
        GoTo ERR_RTN
    Else
        GridOnOff = "Off"
        fg.FixedCols = 0
        Set fg.DataSource = adors
        fg.FixedCols = 1

        Call gridDraw

        fg.Select 1, 1
        'fg.EditCell
        GridOnOff = "On"
    End If

    Exit Function

ERR_RTN:
    MsgBox errMsg
    fnItemSelect = False
    txtItemName.SetFocus
    Exit Function

err_handler:
    errMsg = Err.Description
    GoTo ERR_RTN
End Function

Private Function fnGetItemSelect()
    sSql = ""
    sSql = sSql & " SELECT ISNULL(MAX(ITEM_NO),'*') ITEM_NO FROM ITEM_MAST "
End Function

Private Function fnItemInsert(i)
    sSql = ""
    sSql = sSql & " INSERT INTO ITEM_MAST " & vbCrLf
    sSql = sSql & "       ( " & vbCrLf
    sSql = sSql & "        ITEM_NO , " & vbCrLf
    sSql = sSql & "        ITEM_NAME, " & vbCrLf
    sSql = sSql & "        ITEM_SHOT_NAME, " & vbCrLf
    sSql = sSql & "        UNIT_CD, " & vbCrLf
    sSql = sSql & "        BOX_QTY, " & vbCrLf
    sSql = sSql & "        PRICE, " & vbCrLf
    sSql = sSql & "        COMCODE_COST, " & vbCrLf
    sSql = sSql & "        SALES_COST, " & vbCrLf
    sSql = sSql & "        COMCODE, " & vbCrLf
    sSql = sSql & "        STOCK_YN, " & vbCrLf
    sSql = sSql & "        TAX_YN, " & vbCrLf
    sSql = sSql & "        COST_GBN, " & vbCrLf
    sSql = sSql & "        ITEM_LOCATION, " & vbCrLf
    sSql = sSql & "        STOP_YN, " & vbCrLf
    sSql = sSql & "        ITEM_NICK_NM, " & vbCrLf
    sSql = sSql & "        STOCK_TERM_DAYS, " & vbCrLf
    sSql = sSql & "        PUR_TERM_DAYS, " & vbCrLf
    sSql = sSql & "        ORD_TERM_DAYS, " & vbCrLf
    sSql = sSql & "        EXPIR_DAYS, " & vbCrLf
    sSql = sSql & "        COMCODE_MARGIN, " & vbCrLf
    sSql = sSql & "        DC_MARGIN, " & vbCrLf
    sSql = sSql & "        SALES_MARGIN, " & vbCrLf
    sSql = sSql & "        ITEM_GRP_NM, " & vbCrLf
    sSql = sSql & "        BARCODE, " & vbCrLf
    sSql = sSql & "        OK_DATE " & vbCrLf
    sSql = sSql & "      )  VALUES ( " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(1) & "', " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(2) & "', " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(3) & "', " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(4) & "', " & vbCrLf
    sSql = sSql & "       " & sParam(i)(5) & ",  " & vbCrLf
    sSql = sSql & "       " & sParam(i)(6) & ",  " & vbCrLf
    sSql = sSql & "       " & sParam(i)(7) & ",  " & vbCrLf
    sSql = sSql & "       " & sParam(i)(8) & ",  " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(11) & "', " & vbCrLf
    sSql = sSql & "      'Y', " & vbCrLf
    If sParam(i)(12) = "" Then
        sParam(i)(12) = "N"
    End If
    sSql = sSql & "      '" & sParam(i)(12) & "', " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(13) & "', " & vbCrLf
    sSql = sSql & "      '" & Replace(sParam(i)(10), "SEL", "") & "', " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(14) & "', " & vbCrLf
    sSql = sSql & "      '" & sParam(i)(15) & "', " & vbCrLf    '별칭
    sSql = sSql & "       " & sParam(i)(16) & " , " & vbCrLf    '재고기간
    sSql = sSql & "       " & sParam(i)(17) & " , " & vbCrLf    '발주기간
    sSql = sSql & "       " & sParam(i)(18) & " , " & vbCrLf    '매입기간
    sSql = sSql & "       " & sParam(i)(19) & " , " & vbCrLf    '유통기한
    sSql = sSql & "       " & sParam(i)(20) & " , " & vbCrLf    '출고마진
    sSql = sSql & "       " & sParam(i)(21) & " , " & vbCrLf    '할인마진
    sSql = sSql & "       " & sParam(i)(22) & " , " & vbCrLf    '판매마진
    sSql = sSql & "      '" & sParam(i)(23) & "', " & vbCrLf    '품목그룹명
    sSql = sSql & "      '" & sParam(i)(25) & "', " & vbCrLf    '바코드
    sSql = sSql & "      '" & Replace(gSystemDate_10, "-", "") & "'  " & vbCrLf    '최종매입일자
    sSql = sSql & "      ) " & vbCrLf
End Function

Private Function fnItemUpdate(i)
    sSql = ""
    sSql = sSql & "  UPDATE ITEM_MAST " & vbCrLf
    sSql = sSql & "     SET ITEM_NAME = '" & sParam(i)(2) & "', " & vbCrLf
    sSql = sSql & "         ITEM_SHOT_NAME = '" & sParam(i)(3) & "', " & vbCrLf
    sSql = sSql & "         UNIT_CD = '" & sParam(i)(4) & "', " & vbCrLf
    sSql = sSql & "         BOX_QTY = " & sParam(i)(5) & ", " & vbCrLf
    sSql = sSql & "         PRICE = " & sParam(i)(6) & ", " & vbCrLf
    sSql = sSql & "         COMCODE_COST =" & sParam(i)(7) & ", " & vbCrLf
    sSql = sSql & "         SALES_COST =" & sParam(i)(8) & ", " & vbCrLf
    sSql = sSql & "         COMCODE = '" & sParam(i)(11) & "', " & vbCrLf
    sSql = sSql & "         STOCK_YN  = 'Y', " & vbCrLf
    sSql = sSql & "         ITEM_LOCATION = '" & Replace(sParam(i)(10), "SEL", "") & "', " & vbCrLf
    sSql = sSql & "         TAX_YN =  '" & sParam(i)(12) & "', " & vbCrLf
    sSql = sSql & "         COST_GBN =  '" & sParam(i)(13) & "', " & vbCrLf
    sSql = sSql & "         STOP_YN =  '" & sParam(i)(14) & "', " & vbCrLf
    sSql = sSql & "         ITEM_NICK_NM =  '" & sParam(i)(15) & "', " & vbCrLf   '별칭
    sSql = sSql & "         STOCK_TERM_DAYS =   " & sParam(i)(16) & " , " & vbCrLf   '재고기간
    sSql = sSql & "         PUR_TERM_DAYS =   " & sParam(i)(17) & " , " & vbCrLf   '발주기간
    sSql = sSql & "         ORD_TERM_DAYS =   " & sParam(i)(18) & " , " & vbCrLf   '매입기간
    sSql = sSql & "         EXPIR_DAYS =   " & sParam(i)(19) & " , " & vbCrLf   '유통기한
    sSql = sSql & "         COMCODE_MARGIN =   " & sParam(i)(20) & " , " & vbCrLf   '출고마진
    sSql = sSql & "         DC_MARGIN =   " & sParam(i)(21) & " , " & vbCrLf   '할인마진
    sSql = sSql & "         SALES_MARGIN =   " & sParam(i)(22) & " , " & vbCrLf   '판매마진
    sSql = sSql & "         ITEM_GRP_NM =  '" & sParam(i)(23) & "', " & vbCrLf   '품목그룹명
    sSql = sSql & "         BARCODE     =  '" & sParam(i)(25) & "'  " & vbCrLf   '바코드
    sSql = sSql & "   WHERE ITEM_NO = '" & sParam(i)(1) & "'" & vbCrLf
End Function

Private Function fnCompanyItemUpdate(i)
    sSql = ""
    sSql = sSql & " UPDATE COMPANY_ITEM " & vbCrLf
    sSql = sSql & "    SET ITEM_NAME = '" & sParam(i)(2) & "'," & vbCrLf
    sSql = sSql & "        ITEM_SHOT_NAME = '" & sParam(i)(3) & "'" & vbCrLf
    sSql = sSql & "  WHERE ITEM_NO = '" & sParam(i)(1) & "'" & vbCrLf
End Function

Private Function fnSalesOrderDetUpdate(i)
    sSql = ""
    sSql = sSql & " UPDATE SALES_ORDER_DET " & vbCrLf
    sSql = sSql & "    SET ITEM_NAME = '" & sParam(i)(2) & "'," & vbCrLf
    sSql = sSql & "        ITEM_SHOT_NAME = '" & sParam(i)(3) & "'" & vbCrLf
    sSql = sSql & "  WHERE ITEM_NO = '" & sParam(i)(1) & "'" & vbCrLf
End Function

Private Function fnItemMastDelete()
    sSql = ""
    sSql = sSql & " DELETE ITEM_MAST WHERE ITEM_NO = '" & fg.TextMatrix(fg.Row, 1) & "'"
End Function

Private Function fnCompanyItemChk()
    sSql = ""
    sSql = sSql & " SELECT COUNT(*) FROM COMPANY_ITEM WHERE ITEM_NO = '" & fg.TextMatrix(fg.Row, 1) & "'"
End Function

Private Function fnCompanyItemDelete()
    sSql = ""
    sSql = sSql & " DELETE COMPANY_ITEM WHERE ITEM_NO = '" & fg.TextMatrix(fg.Row, 1) & "'"
End Function

Private Function fnSalesOrderChk()
    sSql = ""
    sSql = sSql & " SELECT * FROM SALES_ORDER_DET WHERE ITEM_NO = '" & fg.TextMatrix(fg.Row, 1) & "'"
End Function

Private Function fnSalesOrderMastDelete(rsData)
    sSql = ""
    sSql = sSql & " DELETE SALES_ORDER_MST " & vbCrLf
    sSql = sSql & "  WHERE SALES_DATE = '" & rsData("SALES_DATE") & "' " & vbCrLf
    sSql = sSql & "    AND COMCODE = '" & rsData("COMCODE") & "' " & vbCrLf
    sSql = sSql & "    AND RETURN_YN = '" & rsData("RETURN_YN") & "' " & vbCrLf
    sSql = sSql & "    AND PROD_SEQ = " & rsData("PROD_SEQ") & vbCrLf
    sSql = sSql & "    AND SALESMAN_CD = '" & rsData("SALESMAN_CD") & "' " & vbCrLf
End Function

Private Function fnSalesOrderDetDelete()
    sSql = ""
    sSql = sSql & " DELETE SALES_ORDER_DET " & vbCrLf
    sSql = sSql & "  WHERE ITEM_NO = '" & fg.TextMatrix(fg.Row, 1) & "'" & vbCrLf
End Function

Private Sub fg_DblClick()

    If fg.Col = 24 Or fg.Col = 26 Then
        fg.Editable = flexEDNone
        Exit Sub
    End If

'''    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" And UCase(Trim(sLoginGbn)) <> "USER4" Then
        If fg.Col = 7 Or fg.Col = 8 Or fg.Col = 24 Or fg.Col = 26 Then
            fg.Editable = flexEDNone
            Exit Sub
        End If
'''    End If

    If fg.Col <> 1 Then
        fg.EditCell
        fg.EditCell
    End If
End Sub

Private Sub fg_StartEdit(ByVal Row As Long, ByVal Col As Long, Cancel As Boolean)

    Call EngOn(fg)

    Select Case Col
        Case 2, 3, 9, 15, 23
            Call HanOn(fg)
    End Select

    oldValue = fg.TextMatrix(Row, Col)

End Sub

Private Sub fg_AfterEdit(ByVal Row As Long, ByVal Col As Long)
    If fg.Col < 2 Or fg.Row < 1 Then Exit Sub

    '                      1      2    3     4      5        6        7         8        9      10     11     12    13    14    15      16        17        18        19        20        21        22         23        24       25
    'fg.FormatString = "<|^코드|<품명|<약어|^단위|>B수량|>구매단가|>출고단가|>판매단가|<구매처|<위치|<CustCd|^과세|^적용|^사용|<별칭|>재고기간|>발주기간|>매입기간|>유통기한|>출고마진|>판매마진|>원가마진|<품목그룹명|>현재고|<바코드"

    If Trim(fg.TextMatrix(Row, 6)) = "" Then
       fg.TextMatrix(Row, 6) = 0
    End If
    If Trim(fg.TextMatrix(Row, 16)) = "" Then
       fg.TextMatrix(Row, 16) = 0
    End If
    If Trim(fg.TextMatrix(Row, 17)) = "" Then
       fg.TextMatrix(Row, 17) = 0
    End If
    If Trim(fg.TextMatrix(Row, 18)) = "" Then
       fg.TextMatrix(Row, 18) = 0
    End If
    If Trim(fg.TextMatrix(Row, 19)) = "" Then
       fg.TextMatrix(Row, 19) = 0
    End If
    If Trim(fg.TextMatrix(Row, 20)) = "" Then
       fg.TextMatrix(Row, 20) = 0
    End If
    If Trim(fg.TextMatrix(Row, 21)) = "" Then
       fg.TextMatrix(Row, 21) = 0
    End If
    If Trim(fg.TextMatrix(Row, 22)) = "" Then
       fg.TextMatrix(Row, 22) = 0
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 6))) = False Then
        MsgBox "구매단가는 숫자 이어야 합니다."
        fg.TextMatrix(Row, 6) = oldValue
        fg.Select Row, 6
        fg.EditCell
        Exit Sub
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 16))) = False Then
        MsgBox "재고기간은 숫자 이어야 합니다."
        fg.TextMatrix(Row, 16) = oldValue
        fg.Select Row, 16
        fg.EditCell
        Exit Sub
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 17))) = False Then
        MsgBox "발주기간은 숫자 이어야 합니다."
        fg.TextMatrix(Row, 17) = oldValue
        fg.Select Row, 17
        fg.EditCell
        Exit Sub
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 18))) = False Then
        MsgBox "매입기간은 숫자 이어야 합니다."
        fg.TextMatrix(Row, 18) = oldValue
        fg.Select Row, 18
        fg.EditCell
        Exit Sub
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 19))) = False Then
        MsgBox "유통기한은 숫자 이어야 합니다."
        fg.TextMatrix(Row, 19) = oldValue
        fg.Select Row, 19
        fg.EditCell
        Exit Sub
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 20))) = False Then
        MsgBox "출고마진은 숫자 이어야 합니다."
        fg.TextMatrix(Row, 20) = oldValue
        fg.Select Row, 20
        fg.EditCell
        Exit Sub
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 21))) = False Then
        MsgBox "판매마진은 숫자 이어야 합니다."
        fg.TextMatrix(Row, 21) = oldValue
        fg.Select Row, 21
        fg.EditCell
        Exit Sub
    End If

    If IsNumeric(Trim(fg.TextMatrix(Row, 22))) = False Then
        MsgBox "원가마진은 숫자 이어야 합니다."
        fg.TextMatrix(Row, 22) = oldValue
        fg.Select Row, 22
        fg.EditCell
        Exit Sub
    End If

    '6,20,21,22
    If Col = 6 Or Col = 20 Or Col = 21 Or Col = 22 Then
        '출고단가 계산
        fg.TextMatrix(Row, 7) = CDbl(fg.TextMatrix(Row, 6)) + CDbl(fg.TextMatrix(Row, 22)) + ((CDbl(fg.TextMatrix(Row, 6)) + CDbl(fg.TextMatrix(Row, 22))) * (CDbl(fg.TextMatrix(Row, 20)) / 100#))
        If fg.TextMatrix(Row, 7) < 2000 Then
            If fg.TextMatrix(Row, 20) <> 0 Then
                fg.TextMatrix(Row, 7) = Round(((fg.TextMatrix(Row, 7) / 10#) + 0.5), 0) * 10#
            End If
        Else
            If fg.TextMatrix(Row, 20) <> 0 Then
                fg.TextMatrix(Row, 7) = Round(((fg.TextMatrix(Row, 7) / 100#) + 0.5), 0) * 100#
            End If
        End If

        '판매단가 계산
        fg.TextMatrix(Row, 8) = CDbl(fg.TextMatrix(Row, 6)) + CDbl(fg.TextMatrix(Row, 22)) + ((CDbl(fg.TextMatrix(Row, 6)) + CDbl(fg.TextMatrix(Row, 22))) * (CDbl(fg.TextMatrix(Row, 21)) / 100#))
        If fg.TextMatrix(Row, 8) < 2000 Then
            If fg.TextMatrix(Row, 21) <> 0 Then
                fg.TextMatrix(Row, 8) = Round(((CDbl(fg.TextMatrix(Row, 8)) / 10#) + 0.5), 0) * 10#
            End If
        Else
            If fg.TextMatrix(Row, 21) <> 0 Then
                fg.TextMatrix(Row, 8) = Round(((CDbl(fg.TextMatrix(Row, 8)) / 100#) + 0.5), 0) * 100#
            End If
        End If
    End If

    If fg.TextMatrix(Row, 0) <> "N" Then
        If oldValue <> fg.TextMatrix(Row, Col) Then
            fg.TextMatrix(Row, 0) = "U"
        End If
    End If
End Sub

Private Sub fg_AfterRowColChange(ByVal OldRow As Long, ByVal OldCol As Long, ByVal NewRow As Long, ByVal NewCol As Long)
    Dim i As Integer
    If NewRow < 1 Or NewCol < 2 Then Exit Sub

'''    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" And UCase(Trim(sLoginGbn)) <> "USER4" Then
        If NewCol = 7 Or NewCol = 8 Or fg.Col = 24 Or fg.Col = 26 Then
            fg.Editable = flexEDNone
            Exit Sub
        End If
'''    End If

    Call fnStartCellColor(fg)
    'fg.EditCell

End Sub

Private Sub fg_Click()
    If fg.Col = 24 Or fg.Col = 26 Then
        fg.Editable = flexEDNone
        Exit Sub
    End If

'''    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" And UCase(Trim(sLoginGbn)) <> "USER4" Then
        If fg.Col = 7 Or fg.Col = 8 Or fg.Col = 24 Or fg.Col = 26 Then
            fg.Editable = flexEDNone
            Exit Sub
        End If
'''    End If

End Sub

Private Sub fg_LeaveCell()
    If fg.Rows < 1 Or fg.Cols < 1 Then Exit Sub
    Call fnLeaveCellColor(fg)
End Sub

Private Sub fg_KeyDown(KeyCode As Integer, Shift As Integer)
    Call fnKeyDown(fg, KeyCode, fg.Row, fg.Col)
End Sub

Private Sub fg_KeyDownEdit(ByVal Row As Long, ByVal Col As Long, KeyCode As Integer, ByVal Shift As Integer)
    Call fnKeyDown(fg, KeyCode, Row, Col)
End Sub

Private Function fnKeyDown(oSheet, KeyCode, Row, Col)
    If Row < 1 Or Col < 1 Then Exit Function

    Dim sSql As Variant
    Dim sOldValue As Variant

    If KeyCode = 27 Then
        Unload Me
    End If

'''    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" And UCase(Trim(sLoginGbn)) <> "USER4" Then
        If Col = 7 Or Col = 8 Or Col = 24 Or Col = 26 Then
            fg.Editable = flexEDNone
            If Col = 7 Then
                fg.Select Row, Col + 1
            Else
                If optAmt.Value = True Then
                    fg.Select Row, 20
                    fg.EditCell
                    fg.EditCell
                ElseIf optPred.Value = True Then
                    fg.Select Row, 16
                    fg.EditCell
                    fg.EditCell
                ElseIf optBarCode.Value = True Then
                    fg.Select Row, 25
                    fg.EditCell
                    fg.EditCell
                Else
                    fg.Select Row, Col + 1
                End If
            End If
            Exit Function
        End If
'''    End If

    If KeyCode = vbKeyF1 Then
        If pComName <> "" Then
            fg.TextMatrix(Row, 9) = pComName
            fg.TextMatrix(Row, 11) = pComCode
            pComName = ""
            pComCode = ""
            oldValue = ""
            Call fg_AfterEdit(Row, 9)
        End If
        fg.EditCell
        Exit Function
    End If

    sOldValue = oldValue
    If KeyCode = 13 Then
        If Col = 9 Then
            fg.Select Row, 9
            If fnGetPurCompany = False Or bParam(9) = "ESC" Then
                fg.Select Row, Col
                fg.EditCell
                fg.EditCell
                Exit Function
            Else
                fg.Select Row, Col + 3
                fg.EditCell
                fg.EditCell
            End If
        ElseIf Col = 10 Then
            fg.Select Row, Col + 2
            fg.EditCell
            fg.EditCell
        ElseIf Col = 23 Then
            If Row < fg.Rows - 1 Then
                If fg.TextMatrix(Row + 1, 0) = "N" Then
                    fg.Select Row + 1, 1
                    fg.EditCell
                    fg.EditCell
                Else
                    fg.Select Row + 1, 2
                    fg.EditCell
                    fg.EditCell
                End If
            Else
                fg.AddItem "N", fg.Rows
                fg.TextMatrix(fg.Rows - 1, 10) = "SEL"
                fg.TextMatrix(fg.Rows - 1, 12) = "Y"
                fg.TextMatrix(fg.Rows - 1, 13) = "1"
                fg.TextMatrix(fg.Rows - 1, 14) = "N"
                fg.Select fg.Rows - 1, 2
                If fg.TextMatrix(fg.Rows - 1, 0) = "N" Then
                    fg.EditCell
                    fg.EditCell
                End If
            End If
        ElseIf Col = 25 Then
            If Row < fg.Rows - 1 Then
                If fg.TextMatrix(Row + 1, 0) = "N" Then
                    fg.Select Row + 1, 1
                    fg.EditCell
                    fg.EditCell
                Else
                    fg.Select Row + 1, 2
                    fg.EditCell
                    fg.EditCell
                End If
            Else
                fg.AddItem "N", fg.Rows
                fg.TextMatrix(fg.Rows - 1, 10) = "SEL"
                fg.TextMatrix(fg.Rows - 1, 12) = "Y"
                fg.TextMatrix(fg.Rows - 1, 13) = "1"
                fg.TextMatrix(fg.Rows - 1, 14) = "N"
                fg.Select fg.Rows - 1, 2
                If fg.TextMatrix(fg.Rows - 1, 0) = "N" Then
                    fg.EditCell
                    fg.EditCell
                End If
            End If
        ElseIf Col = fg.Cols - 1 Then
            Exit Function
        Else
            If Col = 19 Then
                If optPred.Value = True Then
                    fg.Select Row, 23
                Else
                    fg.Select Row, Col + 1
                End If
            Else
                fg.Select Row, Col + 1
            End If
            If Col <> 6 And Col <> 7 And Col <> 24 Then
                fg.EditCell
                fg.EditCell
            End If

        End If
     ElseIf KeyCode = 38 Then
        If Col = 9 Then
            If fnGetPurCompany = False Or bParam(9) = "ESC" Then
                fg.Select Row, Col
                fg.EditCell
                fg.EditCell
            End If
        End If
     ElseIf KeyCode = 40 Then
        If fg.Rows - 1 = fg.Row Then
            fg.AddItem "N", fg.Rows
            fg.TextMatrix(fg.Rows - 1, 10) = "SEL"
            fg.TextMatrix(fg.Rows - 1, 12) = "Y"
            fg.TextMatrix(fg.Rows - 1, 13) = "1"
            fg.TextMatrix(fg.Rows - 1, 14) = "N"
            fg.Select Row + 1, 2
            If fg.TextMatrix(Row + 1, 0) = "N" Then
                fg.EditCell
                fg.EditCell
            End If
        Else
            If fg.Col = 9 Then
                If fnGetPurCompany = False Or bParam(9) = "ESC" Then
                    fg.Select Row, Col
                    fg.EditCell
                    fg.EditCell
                End If
            End If
        End If
    ElseIf KeyCode = 45 Then
        Call cmdIns_Click
    End If

End Function

Private Function fnCompanyReg()
    Call fnParamReSet
    aParam(0) = fg.TextMatrix(fg.Row, 11)
    aParam(5) = "PurCust"
    popCustReg.Show 1
    fg.TextMatrix(fg.Row, 9) = aParam(1)
    fg.TextMatrix(fg.Row, 11) = aParam(0)
    Call fnParamReSet
End Function

Private Function fnPurCompanyInfo()
    Call fnParamReSet
    If fg.Row > 0 Then
        aParam(1) = fg.TextMatrix(fg.Row, 9)
    End If
    aParam(5) = "1"
    popCustInfo.Show 1
    pComName = bParam(2)
    pComCode = bParam(0)
    Call fnParamReSet
End Function

Private Function fnGetPurCompany()
    Dim errMsg As Variant
    Dim sSql As Variant
    fnGetPurCompany = True

    fg.SetFocus
    fg.Select fg.Row, 9

    If fg.TextMatrix(fg.Row, 9) = "" Then Exit Function

    sSql = ""
    sSql = sSql & " SELECT COMCODE,COMNAME " & vbCrLf
    sSql = sSql & "   FROM COMPANY_MAST " & vbCrLf
    sSql = sSql & "  WHERE COMNAME LIKE '" & Trim(fg.TextMatrix(fg.Row, 9)) & "%'" & vbCrLf
    sSql = sSql & "    AND INOUTDIV IN ('1','3')" & vbCrLf
    sSql = sSql & "    AND STOP_YN = 'Y' " & vbCrLf

    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly

    If adors.RecordCount = 0 Then
        errMsg = "찾고자 하는 구매처가 없습니다."
        fg.TextMatrix(fg.Row, 11) = ""
        GoTo ERR_RTN
    ElseIf adors.RecordCount = 1 Then
        fg.TextMatrix(fg.Row, 9) = adors("COMNAME")
        fg.TextMatrix(fg.Row, 11) = adors("COMCODE")
    Else
        Call fnPurCompanyInfo
        If pComName <> "" Then
            fg.TextMatrix(fg.Row, 9) = pComName
            fg.TextMatrix(fg.Row, 11) = pComCode
            pComName = ""
            pComCode = ""
        End If
    End If

    Exit Function

ERR_RTN:
    MsgBox errMsg
    fnGetPurCompany = False
    Exit Function

err_handler:
    errMsg = Err.Description
    GoTo ERR_RTN:

End Function

Private Sub Form_Load()
    Call sFormSize(frmItemMastReg, "99")   '화면크기결정
    Call fnGridCommonStyle(fg)
    Call gridDraw
    fg.Rows = 1
End Sub

Private Sub Form_Activate()

'    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" Then
'        cmdPriceCorrect.Visible = False
'    Else
'        cmdPriceCorrect.Visible = True
'    End If

    txtItemShotName.SetFocus
    Call HanOn(fg)
End Sub

Private Sub Form_KeyDown(KeyCode As Integer, Shift As Integer)
    Select Case KeyCode
        Case vbKeyF1        'F1 Key (거래처검색)
            Call fnPurCompanyInfo
        Case vbKeyF3        'F3 Key (저장)
            Call cmdSave_Click
        Case vbKeyF4        'F4 Key (검색)
            Call cmdSearch_Click
        Case vbKeyF5        'F5 Key (행추가)
            Call cmdReg_Click
        Case vbKeyF6        'F6 Key (거래처등록)
            Call fnCompanyReg
        Case vbKeyF7        'F7 Key (행삭제)
            Call cmdDel_Click
        Case vbKeyF8        'F8 Key (출력)
            Call cmdPrint_Click
        Case vbKeyEscape    'Esc Key (종료)
            Call cmdEsc_Click
        Case vbKeyInsert '45             'INS Key (초기화)
            Call cmdIns_Click
    End Select
End Sub

Private Sub gridDraw()
    Dim i As Integer
    Dim sLocCode As Variant

    fg.FixedRows = 1
    fg.FixedCols = 1
    fg.Cols = 27

    '                      1      2    3     4      5        6        7         8        9      10     11     12    13    14    15      16        17        18        19        20        21        22         23        24       25      26
    'fg.FormatString = "<|^코드|<품명|<약어|^단위|>B수량|>구매단가|>출고단가|>판매단가|<구매처|<위치|<CustCd|^과세|^적용|^사용|<별칭|>재고기간|>발주기간|>매입기간|>유통기한|>출고마진|>판매마진|>원가마진|<품목그룹명|>현재고|<바코드|<최종매입일자"
    fg.FormatString = "<|^코드|<품명|<약어|^단위|>B수량|>구매단가|>출고단가|>판매단가|<구매처|<위치|<CustCd|^과세|^적용|^사용|<별칭|>재고기간|>발주기간|>매입기간|>유통기한|>출고마진|>판매마진|>원가마진|<품목그룹명|>현재고|<바코드|<최종매입일자"
    fg.ColWidth(0) = 400
    fg.ColWidth(1) = 1000
    fg.ColWidth(2) = 3100
    fg.ColWidth(3) = 900
    fg.ColWidth(4) = 700
    fg.ColWidth(5) = 700
    fg.ColWidth(6) = 1100
    fg.ColWidth(7) = 1100
    fg.ColWidth(8) = 1100
    fg.ColWidth(9) = 1800
    fg.ColWidth(10) = 700
    fg.ColWidth(11) = 0
    fg.ColWidth(12) = 700
    fg.ColWidth(13) = 700
    fg.ColWidth(14) = 700

    fg.ColWidth(15) = 1800
    fg.ColWidth(16) = 1000
    fg.ColWidth(17) = 1000
    fg.ColWidth(18) = 1000
    fg.ColWidth(19) = 1000
    fg.ColWidth(20) = 1000
    fg.ColWidth(21) = 1000
    fg.ColWidth(22) = 1000
    fg.ColWidth(23) = 1800
    fg.ColWidth(24) = 1000
    fg.ColWidth(25) = 2500
    fg.ColWidth(26) = 1500

    For i = 1 To fg.Cols - 1
        fg.FixedAlignment(i) = flexAlignCenterCenter
    Next

    fg.ColFormat(5) = "###,##0"
    fg.ColFormat(6) = "###,##0"
    fg.ColFormat(7) = "###,##0"
    fg.ColFormat(8) = "###,##0"
    fg.ColFormat(20) = "##0.0"
    fg.ColFormat(21) = "##0.0"
    'fg.ColFormat(22) = "##0.0"
    fg.ColFormat(22) = "###,##0"
    fg.ColFormat(24) = "###,##0"

    fg.ColComboList(4) = "#EA;EA|#BOX;BOX"

    sLocCode = ""
    Call fnLocMastSelect
    Call fnRecordSet(sSql, adors)
    If adors.RecordCount > 0 Then
        For i = 1 To adors.RecordCount
            If sLocCode = "" Then
                sLocCode = "#SEL;[선택]|#" & adors("LOC_CD") & ";" & adors("LOC_CD")
            Else
                sLocCode = sLocCode & "|#" & adors("LOC_CD") & ";" & adors("LOC_CD")
            End If
            adors.MoveNext
        Next
        fg.ColComboList(10) = sLocCode
    Else
        fg.ColComboList(10) = "#SEL;[선택]"
    End If
    fg.ColComboList(12) = "#Y;과세|#N;비과세"
    fg.ColComboList(13) = "#1;1|#2;2"
    fg.ColComboList(14) = "#Y;미사용|#N;사용"

    If UCase(Trim(sLoginGbn)) = "SMAST" Or UCase(Trim(sLoginGbn)) = "MAST" Or UCase(Trim(sLoginGbn)) = "USER4" Then
       fg.ColHidden(6) = False
    Else
       fg.ColHidden(6) = True
    End If

    fg.ColHidden(11) = True


    If optAll.Value = True Then
        fg.ColHidden(9) = False  '구매처
        fg.ColHidden(10) = False '위치
        fg.ColHidden(12) = False '과세
        fg.ColHidden(13) = False '적용
        fg.ColHidden(14) = False '사용
        fg.ColHidden(15) = False '별칭
        fg.ColHidden(16) = False '재고기간
        fg.ColHidden(17) = False '발주기간
        fg.ColHidden(18) = False '매입기간
        fg.ColHidden(19) = False '유통기한
        fg.ColHidden(20) = False '출고마진
        fg.ColHidden(21) = False '판매마진
        fg.ColHidden(22) = False '원가마진
        fg.ColHidden(23) = False '품목그룹명
        fg.ColHidden(24) = False '현재고
        fg.ColHidden(25) = False '바코드
    ElseIf optAmt.Value = True Then
        fg.ColHidden(9) = True  '구매처
        fg.ColHidden(10) = True '위치
        fg.ColHidden(12) = True '과세
        fg.ColHidden(13) = True '적용
        fg.ColHidden(14) = True '사용
        fg.ColHidden(15) = True '별칭
        fg.ColHidden(16) = True '재고기간
        fg.ColHidden(17) = True '발주기간
        fg.ColHidden(18) = True '매입기간
        fg.ColHidden(19) = True '유통기한
        fg.ColHidden(20) = False '출고마진
        fg.ColHidden(21) = False '판매마진
        fg.ColHidden(22) = False '원가마진
        fg.ColHidden(23) = False '품목그룹명
        fg.ColHidden(24) = False '현재고
        fg.ColHidden(25) = True '바코드
    ElseIf optPred.Value = True Then
        fg.ColHidden(9) = True  '구매처
        fg.ColHidden(10) = True '위치
        fg.ColHidden(12) = True '과세
        fg.ColHidden(13) = True '적용
        fg.ColHidden(14) = True '사용
        fg.ColHidden(15) = True '별칭
        fg.ColHidden(16) = False '재고기간
        fg.ColHidden(17) = False '발주기간
        fg.ColHidden(18) = False '매입기간
        fg.ColHidden(19) = False '유통기한
        fg.ColHidden(20) = True '출고마진
        fg.ColHidden(21) = True '판매마진
        fg.ColHidden(22) = True '원가마진
        fg.ColHidden(23) = False '품목그룹명
        fg.ColHidden(24) = False '현재고
        fg.ColHidden(25) = True '바코드
    ElseIf optBarCode.Value = True Then
        fg.ColHidden(9) = True  '구매처
        fg.ColHidden(10) = True '위치
        fg.ColHidden(12) = True '과세
        fg.ColHidden(13) = True '적용
        fg.ColHidden(14) = True '사용
        fg.ColHidden(15) = True '별칭
        fg.ColHidden(16) = True '재고기간
        fg.ColHidden(17) = True '발주기간
        fg.ColHidden(18) = True '매입기간
        fg.ColHidden(19) = True '유통기한
        fg.ColHidden(20) = True '출고마진
        fg.ColHidden(21) = True '판매마진
        fg.ColHidden(22) = True '원가마진
        fg.ColHidden(23) = True '품목그룹명
        fg.ColHidden(24) = True '현재고
        fg.ColHidden(25) = False '바코드
    End If


    fg.Top = 1500
    fg.Left = 10
    fg.Width = Me.ScaleWidth - fg.Left
    fg.Height = Me.ScaleHeight - fg.Top
    fg.Redraw = True
End Sub

Private Function fnLocMastSelect()
    sSql = ""
    sSql = sSql & " SELECT * " & vbCrLf
    sSql = sSql & "   FROM LOC_MAST " & vbCrLf
    sSql = sSql & "  WHERE USE_YN = 'Y' " & vbCrLf
    sSql = sSql & "  ORDER BY LOC_CD ASC " & vbCrLf
End Function

Private Sub fnRecordSet(sSql, adors)
    Set adors = New ADODB.Recordset
    adors.Open sSql, adocon, adOpenForwardOnly, adLockReadOnly
End Sub

Private Sub fnEditCell(iRow, iCol)
    fg.Select iRow, iCol
    fg.EditCell
End Sub

Private Sub optAll_Click()
    '                      1      2    3     4      5        6        7         8        9      10     11     12    13    14    15      16        17        18        19        20        21        22         23        24       25
    'fg.FormatString = "<|^코드|<품명|<약어|^단위|>B수량|>구매단가|>출고단가|>판매단가|<구매처|<위치|<CustCd|^과세|^적용|^사용|<별칭|>재고기간|>발주기간|>매입기간|>유통기한|>출고마진|>판매마진|>원가마진|<품목그룹명|>현재고|<바코드"
    fg.ColHidden(9) = False  '구매처
    fg.ColHidden(10) = False '위치
    fg.ColHidden(12) = False '과세
    fg.ColHidden(13) = False '적용
    fg.ColHidden(14) = False '사용
    fg.ColHidden(15) = False '별칭
    fg.ColHidden(16) = False '재고기간
    fg.ColHidden(17) = False '발주기간
    fg.ColHidden(18) = False '매입기간
    fg.ColHidden(19) = False '유통기한
    fg.ColHidden(20) = False '출고마진
    fg.ColHidden(21) = False '판매마진
    fg.ColHidden(22) = False '원가마진
    fg.ColHidden(23) = False '품목그룹명
    fg.ColHidden(24) = False '현재고
    fg.ColHidden(25) = False '바코드
End Sub

Private Sub optAmt_Click()
    fg.ColHidden(9) = True  '구매처
    fg.ColHidden(10) = True '위치
    fg.ColHidden(12) = True '과세
    fg.ColHidden(13) = True '적용
    fg.ColHidden(14) = True '사용
    fg.ColHidden(15) = True '별칭
    fg.ColHidden(16) = True '재고기간
    fg.ColHidden(17) = True '발주기간
    fg.ColHidden(18) = True '매입기간
    fg.ColHidden(19) = True '유통기한
    fg.ColHidden(20) = False '출고마진
    fg.ColHidden(21) = False '판매마진
    fg.ColHidden(22) = False '원가마진
    fg.ColHidden(23) = False '품목그룹명
    fg.ColHidden(24) = False '현재고
    fg.ColHidden(25) = True '바코드
End Sub

Private Sub optBarCode_Click()
    fg.ColHidden(9) = True  '구매처
    fg.ColHidden(10) = True '위치
    fg.ColHidden(12) = True '과세
    fg.ColHidden(13) = True '적용
    fg.ColHidden(14) = True '사용
    fg.ColHidden(15) = True '별칭
    fg.ColHidden(16) = True '재고기간
    fg.ColHidden(17) = True '발주기간
    fg.ColHidden(18) = True '매입기간
    fg.ColHidden(19) = True '유통기한
    fg.ColHidden(20) = True '출고마진
    fg.ColHidden(21) = True '판매마진
    fg.ColHidden(22) = True '원가마진
    fg.ColHidden(23) = True '품목그룹명
    fg.ColHidden(24) = True '현재고
    fg.ColHidden(25) = False '바코드
End Sub

Private Sub optPred_Click()
    fg.ColHidden(9) = True  '구매처
    fg.ColHidden(10) = True '위치
    fg.ColHidden(12) = True '과세
    fg.ColHidden(13) = True '적용
    fg.ColHidden(14) = True '사용
    fg.ColHidden(15) = True '별칭
    fg.ColHidden(16) = False '재고기간
    fg.ColHidden(17) = False '발주기간
    fg.ColHidden(18) = False '매입기간
    fg.ColHidden(19) = False '유통기한
    fg.ColHidden(20) = True '출고마진
    fg.ColHidden(21) = True '판매마진
    fg.ColHidden(22) = True '원가마진
    fg.ColHidden(23) = False '품목그룹명
    fg.ColHidden(24) = False '현재고
    fg.ColHidden(25) = True '바코드
End Sub

Private Sub txtItemName_1_KeyPress(KeyAscii As Integer)
    If KeyAscii <> 13 Then
        Call fnIns("txtItemName_1")
    End If
End Sub

Private Sub txtItemName_KeyDown(KeyCode As Integer, Shift As Integer)
    If KeyCode = 13 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 40 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 38 Then
        SendKeys "+{TAB}"
    End If
End Sub


Private Sub txtItemName_KeyPress(KeyAscii As Integer)
    If KeyAscii <> 13 Then
        Call fnIns("txtItemName")
    End If
End Sub

Private Sub txtItemShotName_KeyDown(KeyCode As Integer, Shift As Integer)
    If KeyCode = 13 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 40 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 38 Then
        SendKeys "+{TAB}"
    End If
End Sub

Private Sub txtItemName_1_KeyDown(KeyCode As Integer, Shift As Integer)
    If KeyCode = 13 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 40 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 38 Then
        SendKeys "+{TAB}"
    End If
End Sub

Private Sub txtItemName_lostFocus()
    Call gf_LostColor(txtItemName)
    Call HanOn(txtItemShotName)
End Sub

Private Sub txtItemName_GotFocus()
    Call gf_GotColor(txtItemName)
End Sub

Private Sub txtItemShotName_GotFocus()
    Call gf_GotColor(txtItemShotName)
    Call HanOn(txtItemShotName)
End Sub

Private Sub txtItemShotName_KeyPress(KeyAscii As Integer)
    If KeyAscii <> 13 Then
       Call fnIns("txtItemShotName")
    End If
End Sub

Private Sub txtItemShotName_lostFocus()
    Call gf_LostColor(txtItemShotName)
End Sub

Private Sub txtItemName_1_GotFocus()
    Call gf_GotColor(txtItemName_1)
    Call HanOn(txtItemShotName)
End Sub

Private Sub txtItemName_1_lostFocus()
    Call gf_LostColor(txtItemName_1)
End Sub

Private Sub fnIns(insFlag As Variant)
    If insFlag = "All" Then
        txtItemName = ""
        txtItemShotName = ""
        txtItemName_1 = ""
        txtItemShotName.SetFocus
        fg.Rows = 1
    ElseIf insFlag = "txtItemName" Then
        txtItemShotName = ""
        txtItemName_1 = ""
    ElseIf insFlag = "txtItemNo" Then
        txtItemName = ""
        txtItemShotName = ""
        txtItemName_1 = ""
    ElseIf insFlag = "txtItemShotName" Then
        txtItemName = ""
        txtItemName_1 = ""
    ElseIf insFlag = "txtItemName_1" Then
        txtItemName = ""
        txtItemShotName = ""
    End If
End Sub

Private Sub cmdPrint_Click()
    If UCase(Trim(sLoginGbn)) <> "SMAST" And UCase(Trim(sLoginGbn)) <> "MAST" And UCase(Trim(sLoginGbn)) <> "USER4" Then
        MsgBox "권한이 없습니다."
        Exit Sub
    End If

    gHypenLine = "------------------------------------------------------------------------------------------------"

    Call fnHeadPrint("First")
    Call fnBodyPrint
    If Mid(pl, 1, 4) <> "----" Then
        pl = gHypenLine: y = y + 1
        Call fnPrinting(0, y, pl)
    End If
    Printer.EndDoc

End Sub

Private Sub fnHeadPrint(PrintDiv)
    Dim i As Integer
    Dim j As Integer

    '                      1      2    3     4      5        6        7         8        9      10     11     12    13    14    15      16        17        18        19        20        21        22         23        24       25
    'fg.FormatString = "<|^코드|<품명|<약어|^단위|>B수량|>구매단가|>출고단가|>판매단가|<구매처|<위치|<CustCd|^과세|^적용|^사용|<별칭|>재고기간|>발주기간|>매입기간|>유통기한|>출고마진|>판매마진|>원가마진|<품목그룹명|>현재고|<바코드"

    If PrintDiv = "First" Then
        y = 0
        Printer.ScaleMode = 4
        Call fnFontSet(13, "", True)
        pl = "품목리스트": y = y + 1
        Call fnPrinting(38, y, pl)

        Call fnFontSet(11, "", False)
    Else
        y = 3
    End If

    pl = gHypenLine: y = y + 3
    Call fnPrinting(0, y, pl)

    pl = "순번": y = y + 1
    Call fnPrinting(0, y, pl)

    pl = "품명"
    Call fnPrinting(6, y, pl)

    pl = "단위"
    Call fnPrinting(36, y, pl)

    pl = "B수량"
    Call fnPrinting(43, y, pl)

    pl = "출고단가"
    Call fnPrinting(50, y, pl)

    pl = "판매단가"
    Call fnPrinting(62, y, pl)

    pl = "위치"
    Call fnPrinting(80, y, pl)

    pl = gHypenLine: y = y + 1
    Call fnPrinting(0, y, pl)

End Sub

Private Function fnBodyPrint()

    Dim sPageCnt As Integer
    Dim sLineCnt As Integer
    Dim sSeqNo As Integer

    sPageCnt = -1
    sLineCnt = -1


    For i = 1 To fg.Rows - 1

        sPageCnt = sPageCnt + 1
        sLineCnt = sLineCnt + 1
        sSeqNo = sSeqNo + 1

        If sLineCnt = 5 Then
            If Mid(pl, 1, 4) <> "----" Then
                pl = gHypenLine: y = y + 1
                Call fnPrinting(0, y, pl)
            End If
            sLineCnt = 0
        End If

        If sPageCnt = 40 Then
            If Mid(pl, 1, 4) <> "----" Then
                pl = gHypenLine: y = y + 1
                Call fnPrinting(0, y, pl)
            End If

            Printer.NewPage

            If i < fg.Rows - 1 Then
                Call fnHeadPrint("Second")
            End If

            sPageCnt = 0
            sLineCnt = 0
        End If

        y = y + 1

        '                      1      2    3     4      5        6        7         8        9      10     11     12    13    14    15      16        17        18        19        20        21        22         23        24       25
        'fg.FormatString = "<|^코드|<품명|<약어|^단위|>B수량|>구매단가|>출고단가|>판매단가|<구매처|<위치|<CustCd|^과세|^적용|^사용|<별칭|>재고기간|>발주기간|>매입기간|>유통기한|>출고마진|>판매마진|>원가마진|<품목그룹명|>현재고|<바코드"

        pl = fNumRight_Align(3, sSeqNo)
        Call fnPrinting(0, y, pl) '순번

        pl = fLeftH(LTrim(fg.TextMatrix(i, 2)), 29)
        Call fnPrinting(6, y, pl) '품명

        pl = fLeftH(LTrim(fg.TextMatrix(i, 4)), 4)
        Call fnPrinting(37, y, pl) '단위

        pl = fNumRight_Align(10, fg.TextMatrix(i, 5))
        Call fnPrinting(38, y, pl) 'b수량

        pl = fNumRight_Align(10, fg.TextMatrix(i, 7))
        Call fnPrinting(48, y, pl) '출고단가

        pl = fNumRight_Align(10, fg.TextMatrix(i, 8))
        Call fnPrinting(60, y, pl) '판매단가

        pl = fLeftH(LTrim(fg.TextMatrix(i, 10)), 10) '위치
        Call fnPrinting(80, y, pl) '판매단가

    Next

End Function

Private Sub txtPurCompany_KeyDown(KeyCode As Integer, Shift As Integer)
    If KeyCode = 13 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 40 Then
        SendKeys "{TAB}"
    ElseIf KeyCode = 38 Then
        SendKeys "+{TAB}"
    End If
End Sub

Private Sub txtPurCompany_KeyPress(KeyAscii As Integer)
    If KeyAscii <> 13 Then
        txtItemName = ""
        txtItemName_1 = ""
        txtItemShotName = ""
    End If
End Sub

Private Sub cmdExcel_Click()
    If UCase(Trim(sLoginGbn)) = "SALESMAN" Then
        MsgBox "권한이 없습니다."
        Exit Sub
    End If

    Dim arrHidden() As Variant

    ReDim arrHidden(fg.Cols - 1)

    Dim i As Integer

    For i = 1 To fg.Cols - 1
        If fg.ColHidden(i) = False Then
            arrHidden(i) = 1
        Else
            arrHidden(i) = 0
        End If
    Next

    If MsgBox("엑셀을 실행 하시겠습니까?", vbQuestion + vbYesNo, "엑셀실행") = vbNo Then
        Exit Sub
        'Call fnExcel(fg, "Save", "일일출고현황.xls")
    Else
        Call fnExcel(fg, "Screen", "품목마스터.xls", arrHidden)
    End If
End Sub









								                                            TB_ITM_CD	품목코드정보	CO_CD	회사코드	VARCHAR	VARCHAR(10)	PK	NOT NULL	Y
ITEM_MAST	품목코드정보	ITEM_NO	품목번호	VARCHAR	VARCHAR(15)	PK	NOT NULL	TB_ITM_CD	품목코드정보	ITEM_NO	품목번호	VARCHAR	VARCHAR(15)	PK	NOT NULL	Y
ITEM_MAST	품목코드정보	ITEM_NAME	품목명	VARCHAR	VARCHAR(100)		NULL	TB_ITM_CD	품목코드정보	ITEM_NM	품목명	VARCHAR	VARCHAR(300)		NULL	Y
ITEM_MAST	품목코드정보	ITEM_SHOT_NAME	품목약어명	VARCHAR	VARCHAR(50)		NULL	TB_ITM_CD	품목코드정보	ITEM_ABBR	품목약어명	VARCHAR	VARCHAR(300)		NULL	Y
ITEM_MAST	품목코드정보	OK_DATE	최종매입일자	VARCHAR	VARCHAR(8)		NULL	TB_ITM_CD	품목코드정보	LAST_PUR_DT	최종매입일자	VARCHAR	VARCHAR(8)		NULL	Y
ITEM_MAST	품목코드정보	UNIT_CD	단위구분코드	VARCHAR	VARCHAR(10)		NOT NULL	TB_ITM_CD	품목코드정보	UNIT_GCD	단위구분코드	VARCHAR	VARCHAR(10)		NULL	Y
ITEM_MAST	품목코드정보	BOX_QTY	박스수량	DECIMAL	DECIMAL(4,0)		NULL	TB_ITM_CD	품목코드정보	BOX_QTY	박스수량	BIGINT	BIGINT		NULL	Y
ITEM_MAST	품목코드정보	COMCODE	거래처코드	VARCHAR	VARCHAR(15)		NULL	TB_ITM_CD	품목코드정보	CUST_CD	거래처코드	VARCHAR	VARCHAR(15)		NULL	Y
ITEM_MAST	품목코드정보	PRICE	매입단가	DECIMAL	DECIMAL(20,6)		NULL	TB_ITM_CD	품목코드정보	PUR_PRC	매입단가	DECIMAL	DECIMAL(20,3)		NULL	Y
ITEM_MAST	품목코드정보	COMCODE_COST	촐고단가	DECIMAL	DECIMAL(20,6)		NULL	TB_ITM_CD	품목코드정보	OUT_PRC	출고단가	DECIMAL	DECIMAL(20,3)		NULL	Y
ITEM_MAST	품목코드정보	SALES_COST	판매단가	DECIMAL	DECIMAL(20,6)		NULL	TB_ITM_CD	품목코드정보	SAL_PRC	판매단가	DECIMAL	DECIMAL(20,3)		NULL	Y
ITEM_MAST	품목코드정보	ITEM_LOCATION	품목위치	VARCHAR	VARCHAR(100)		NULL	TB_ITM_CD	품목코드정보	ITEM_LOC_CD	품목위치코드	VARCHAR	VARCHAR(10)		NULL	Y	TB_WH_LOC.LOC_CD
ITEM_MAST	품목코드정보	STOCK_QTY	재고수량	DECIMAL	DECIMAL(20,6)		NULL	TB_ITM_CD	품목코드정보	STK_QTY	재고수량	BIGINT	BIGINT		NULL	Y
ITEM_MAST	품목코드정보	STOCK_YN	재고여부	VARCHAR	VARCHAR(1)		NULL	TB_ITM_CD	품목코드정보	STK_YN	재고여부	VARCHAR	VARCHAR(1)		NULL	Y
ITEM_MAST	품목코드정보	STOCK_ADJ_DATE	재고조정일자	VARCHAR	VARCHAR(8)		NULL	TB_ITM_CD	품목코드정보	STK_ADJ_DT	재고조정일자	VARCHAR	VARCHAR(8)		NULL	Y
ITEM_MAST	품목코드정보	TAX_YN	과세여부	VARCHAR	VARCHAR(1)		NULL	TB_ITM_CD	품목코드정보	TAX_YN	과세여부	VARCHAR	VARCHAR(1)		NULL	Y
ITEM_MAST	품목코드정보	COST_GBN	단가적용구분	VARCHAR	VARCHAR(1)		NULL	TB_ITM_CD	품목코드정보	PRC_APLY_GCD	단가적용구분코드	VARCHAR	VARCHAR(1)		NULL	Y
ITEM_MAST	품목코드정보	ITEM_NICK_NM	품목별칭명	VARCHAR	VARCHAR(50)		NULL	TB_ITM_CD	품목코드정보	ITEM_ALIAS	품목별칭명	VARCHAR	VARCHAR(300)		NULL	Y
ITEM_MAST	품목코드정보	STOCK_TERM_DAYS	재고기간	BIGINT	BIGINT		NULL	TB_ITM_CD	품목코드정보	STK_PER	재고기간	BIGINT	BIGINT		NULL	Y
ITEM_MAST	품목코드정보	PUR_TERM_DAYS	발주기간	BIGINT	BIGINT		NULL	TB_ITM_CD	품목코드정보	ORD_PER	발주기간	BIGINT	BIGINT		NULL	Y
ITEM_MAST	품목코드정보	ORD_TERM_DAYS	매입기간	BIGINT	BIGINT		NULL	TB_ITM_CD	품목코드정보	PUR_PER	매입기간	BIGINT	BIGINT		NULL	Y
ITEM_MAST	품목코드정보	EXPIR_DAYS	유통기한	BIGINT	BIGINT		NULL	TB_ITM_CD	품목코드정보	EXP_PER	유통기한	BIGINT	BIGINT		NULL	Y
ITEM_MAST	품목코드정보	STOP_YN	판매중지여부	VARCHAR	VARCHAR(1)		NULL	TB_ITM_CD	품목코드정보	SAL_STOP_YN	판매중지여부	VARCHAR	VARCHAR(1)		NULL	Y
ITEM_MAST	품목코드정보	COMCODE_MARGIN	출고마진	DECIMAL	DECIMAL(18,1)		NULL	TB_ITM_CD	품목코드정보	OUT_MRGN_RT	출고마진율	DECIMAL	DECIMAL(18,3)		NULL	Y
ITEM_MAST	품목코드정보	DC_MARGIN	할인마진	DECIMAL	DECIMAL(18,1)		NULL	TB_ITM_CD	품목코드정보	DC_MRGN_RT	할인마진율	DECIMAL	DECIMAL(18,3)		NULL	Y
ITEM_MAST	품목코드정보	SALES_MARGIN	판매마진	DECIMAL	DECIMAL(18,1)		NULL	TB_ITM_CD	품목코드정보	SAL_MRGN_RT	판매마진율	DECIMAL	DECIMAL(18,3)		NULL	Y
ITEM_MAST	품목코드정보	ITEM_GRP_NM	품목그룹명	VARCHAR	VARCHAR(20)		NULL	TB_ITM_CD	품목코드정보	ITEM_GRP_NM	품목그룹명	VARCHAR	VARCHAR(300)		NULL	Y
ITEM_MAST	품목코드정보	BARCODE	바코드	VARCHAR	VARCHAR(20)		NULL	TB_ITM_CD	품목코드정보	BARCODE	바코드	VARCHAR	VARCHAR(20)		NULL	Y
ITEM_MAST	품목코드정보	BARCODE_SUB	바코드SUB	VARCHAR	VARCHAR(20)		NULL	TB_ITM_CD	품목코드정보	BARCODE_SUB	바코드SUB	VARCHAR	VARCHAR(20)		NULL	Y
ITEM_MAST	품목코드정보	REG_DTM	등록일시	DATETIME	DATETIME		NOT NULL	TB_ITM_CD	품목코드정보	REG_DTM	등록일시	DATETIME	DATETIME		NOT NULL	Y
ITEM_MAST	품목코드정보	REGR_ID	등록자ID	VARCHAR	VARCHAR(20)		NOT NULL	TB_ITM_CD	품목코드정보	REGR_ID	등록자ID	VARCHAR	VARCHAR(20)		NOT NULL	Y
ITEM_MAST	품목코드정보	UPD_DTM	수정일시	DATETIME	DATETIME		NOT NULL	TB_ITM_CD	품목코드정보	UPD_DTM	수정일시	DATETIME	DATETIME		NOT NULL	Y
ITEM_MAST	품목코드정보	UPDR_ID	수정자ID	VARCHAR	VARCHAR(20)		NOT NULL	TB_ITM_CD	품목코드정보	UPDR_ID	수정자ID	VARCHAR	VARCHAR(20)		NOT NULL	Y
