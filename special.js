const faktura = `"Sprzedawca          
AB SPÓŁKA AKCYJNA            Faktura VAT                                               Str.   1     EUROPEJSKA 4                 NR: A2154365                             Data wystawienia 22/02/07     55−040   MAGNICE                                                                                    NIP: PL8951628481                                                                                   NR BDO 000011269                                                                                    Credit Agricole Bank Polska SA o/Wrocław nr 50 1940 1210 0103 6426 0010 0000                        
 
 
   NABYWCA:  32131171           PLATNIK:  32131171           ODBIORCA: 00131248                     
   SILESIA PROTECH Sp. z o.o.   SILESIA PROTECH Sp. z o.o.   SILESIA PROTECH Sp. z o.o.             
                                                                                                    
   Augustyna Świdra 29          Augustyna Świdra 29          Szafranka 11                           
                                                                                                       
   40−748   Katowice            40−748   Katowice            43−190   Mikołów                       
   NIP: PL9542812880            NIP: PL9542812880            NIP:                                   
 
                                                         Forma platnosci: Przelew 7 dni             
                                                         Termin platnosci: 22/02/14                                
 
 
   Nr zlecenia: IM3JI32B                                                                            
   NR WZ: WZ_21 21449997   Data wydania: 22/02/07                                                   
   NR KA: MGN−02947188                                                                              
−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
lp    indeks         o p i s  t o w a r u    jm    ilosc   cena jedn    wartosc  staw     kwota     wartosc 
       SWW                                                   netto       netto   VAT       VAT       brutto 
−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
  1 AILAGA000000014 *Adapter USB TYPE−C(F)   sz      1.0       9.88        9.88 23.0       2.27       12.15 
                    AM  3.1 15 cm                                                                            
    INDD: AD−UC−UA−03                                                                                       
  2 AZGCEUA30000003 *Akumulatorki Paluszki   sz      1.0       8.15        8.15 23.0       1.87       10.02 
                    2x AAA HR03 800mAh                                                                      
    INDD: GR08                                                                                              
  3 AZGCEUA60000002 *Akumulatorki Paluszki   sz      1.0      18.48       18.48 23.0       4.25       22.73 
                    4x AA HR6 2000 mAh                                                                      
    INDD: GR02                                                                                              
  4 AKTBXAJ2RCA250B !TB Kabel 3,5mm MiniJack sz      1.0       7.60        7.60 23.0       1.75       9.35 
                    −2x RCA M/M chinch 2,5m                                                                 
    INDD: AKTBXAJ2RCA250B                                                                                   
  5 AKASSVA00000014 *Konwerter VGA−HDMI      sz      1.0      66.61       66.61 23.0      15.32       81.93 
                    FHD z audio  3.5mm                                                                       
    INDD: DA−70473                                                                                          
  6 AKLLIKSAOKAB039 Organizator kablowy      sz      1.0       9.53        9.53 23.0       2.19       11.72 
                                                                                                            
    INDD: KAB0039                                                                                           
  7 SGGOD2G32UME2W0 *UME2 32GB USB 2.0       sz      1.0      12.51       12.51 23.0       2.88       15.39 
                    Bialy                                                                                   
    INDD: UME2−0320W0R11                                                                                    
  8 AJARTL0000AR57A *ART Uchwyt LCD AR−57a   sz      2.0      37.00       74.00 23.0      17.02       91.02 
                    17−42’’ 25KG pion/poziom                                                                
    INDD: RAMART AR−57A                                                                                     
  9 Oplata transportowa                                       12.00       12.00 23.0       2.76       14.76 
−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
                                                              Razem      218.76           50.31      269.07 
                                                   W tym wq st. VAT                                         
                                                                 −−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
                                                             23.0 |      218.76           50.31      269.07 
                                                                 ===========================================
 
 
 
Do zaplaty:        269.07 PLN                                                                              
Slownie PLN dwieście sześćdziesiąt dziewięć i 7/100.                                                        
 
 
 
          _______________                               _______________                             
           N A B Y W C A                                W Y S T A W I L                             
      Imie i nazwisko oraz podpis                     Imie i nazwisko oraz podpis                   
      osoby uprawnionej do otrzymania                 osoby uprawnionej do wystawienia              
      dokumentu   Faktura VAT                         dokumentu  Faktura VAT                        
 
Nazwiska osob upowaznionych do odbioru towaru               upowaznienie   
 "																																												
																																												
`


function getAllEnterIndexes(cellString)
{
    let indexes = []
    
    for(let i = 0; i<cellString.length; i++)
    {
        if(cellString[i]=='\n')
        {
            indexes.push(i)
        }
    }

    return indexes
}

function extractProductNettoPrice(cellString, productInfo)
{
    let index=cellString.indexOf(productInfo)

    let enterIndexes=getAllEnterIndexes(cellString)

    let beginning = ''
    let end = ''
    for(let enter of enterIndexes)
    {
        if(enter < index)
        {
            beginning = enter + 1
        }
        else
        {
            end = enter
            break
        }
    }

    cellArr=cellString.slice(beginning, end).split(/\s\s+/g)
    cellArr=cellArr.filter(function(value, index, arr){ 
        return value != '';
    });
    

    return cellArr[3]
    
}


extractProductNettoPrice(faktura, 'AILAGA000000014')