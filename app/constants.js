/////////////////////////////////////////////////////////
//                                                     //
// Purpose: Defines constants within the app           //
//                                                     //
// What it contains:                                   //
//      - Colours Themes                               //
//      - EN/FR Translations                           //
//      - Strings                                      //
//      - Enumerations                                 //
//                                                     //
/////////////////////////////////////////////////////////


// ################## CONSTANTS ###############################

// Different Pages in the App
export const Pages = {
    Home: "Home",
    TrendsOverTime: "TrendsOverTime",
    Overview: "Overview",
    About: "About",
    Contact: "Contact"
}

// File locations for each page
export const PageSrc = {};
PageSrc[Pages.TrendsOverTime] = "./templates/trendsOverTime.html"
PageSrc[Pages.Overview] = "./templates/overview.html"
PageSrc[Pages.About] = "./templates/about.html"
PageSrc[Pages.Contact] = "./templates/contact.html"

// SVG Icons that are inserted to the website at runtime
export const SVGIcons = {
    EyeOpen: `
    <path class="svgIconPath" d="M0 0 C70.82410998 -1.62151699 130.12337336 24.99875515 183.73095703 69.46240234 C186.32467978 71.61028802 188.92988098 73.74363467 191.53759766 75.87451172 C192.39095703 76.57189453 193.24431641 77.26927734 194.12353516 77.98779297 C194.96142578 78.67228516 195.79931641 79.35677734 196.66259766 80.06201172 C198.49604802 81.56186867 200.32937937 83.06187112 202.16259766 84.56201172 C203.07009766 85.30451172 203.97759766 86.04701172 204.91259766 86.81201172 C213.16259766 93.56201172 213.16259766 93.56201172 215.90869141 95.81201172 C217.75088276 97.31712125 219.59727916 98.81709804 221.44775391 100.31201172 C245.70344367 119.96219077 245.70344367 119.96219077 247.98291016 137.53076172 C248.43876924 146.89106815 245.59209599 156.87495452 239.54931641 164.10498047 C233.24359157 170.64570126 226.32224175 176.45863059 219.18994141 182.06982422 C214.62663973 185.66686263 210.15450331 189.37650708 205.66259766 193.06201172 C203.82949604 194.56229488 201.99616338 196.0622958 200.16259766 197.56201172 C199.25509766 198.30451172 198.34759766 199.04701172 197.41259766 199.81201172 C189.16259766 206.56201172 189.16259766 206.56201172 186.38525391 208.83154297 C184.6393093 210.26186488 182.8967984 211.69639457 181.15869141 213.13623047 C178.34131862 215.46325135 175.50859052 217.77016452 172.66259766 220.06201172 C172.01403809 220.58456543 171.36547852 221.10711914 170.69726562 221.64550781 C146.23439108 241.25726045 119.54748997 257.12778033 89.66259766 267.06201172 C88.83211914 267.33980469 88.00164062 267.61759766 87.14599609 267.90380859 C22.69796748 289.11202552 -47.07056188 282.22492551 -107.42333984 252.12841797 C-126.59055661 242.32357848 -143.98263875 229.77754711 -160.23583984 215.70263672 C-163.49462202 212.89513452 -166.87483463 210.25774566 -170.27490234 207.62451172 C-175.69129831 203.42176049 -180.91122806 199.03690812 -186.0871582 194.54272461 C-190.08092638 191.09267491 -194.16599241 187.79427182 -198.33740234 184.56201172 C-203.25354745 180.7404987 -208.08699987 176.83820572 -212.83740234 172.81201172 C-213.40072266 172.34085938 -213.96404297 171.86970703 -214.54443359 171.38427734 C-219.98997125 166.72502854 -225.14881519 161.79021088 -227.64990234 154.93701172 C-228.10816406 153.72658203 -228.10816406 153.72658203 -228.57568359 152.49169922 C-231.90378129 141.87592094 -230.53655472 132.27120094 -226.33740234 122.06201172 C-220.88583477 112.07882859 -210.61881599 105.1942666 -201.79248047 98.35961914 C-197.53126218 95.04616644 -193.41162101 91.60210329 -189.33740234 88.06201172 C-184.20434967 83.60462469 -178.95032145 79.35749662 -173.57421875 75.19775391 C-169.5016896 72.02784634 -165.59363107 68.71196132 -161.71240234 65.31201172 C-116.59555316 26.18168578 -60.12829108 1.59521474 0 0 Z M-60.33740234 66.06201172 C-61.01158203 66.63306641 -61.68576172 67.20412109 -62.38037109 67.79248047 C-81.20303432 85.18444245 -91.27774382 111.30204709 -92.50537109 136.51123047 C-92.65554296 161.40972654 -85.118709 184.68992974 -69.33740234 204.06201172 C-68.34160156 205.30337891 -68.34160156 205.30337891 -67.32568359 206.56982422 C-52.10682936 224.51738245 -30.49869663 236.20179601 -7.33740234 240.06201172 C-6.67224609 240.17287109 -6.00708984 240.28373047 -5.32177734 240.39794922 C19.66754561 243.82241199 45.82818906 237.59563776 66.47509766 223.08544922 C68.9437283 221.14911706 71.30832388 219.13535535 73.66259766 217.06201172 C74.48115234 216.38654297 75.29970703 215.71107422 76.14306641 215.01513672 C96.47096952 197.7442981 107.65145074 172.36482761 109.83105469 146.02636719 C111.47643226 117.83464692 100.71980653 92.18812408 82.66259766 71.06201172 C82.09154297 70.38783203 81.52048828 69.71365234 80.93212891 69.01904297 C63.77903014 50.45489237 37.86826325 40.23135913 12.97900391 38.85888672 C-14.97423001 38.50983489 -39.19583227 47.99159061 -60.33740234 66.06201172 Z M119.66259766 64.06201172 C121.09804861 68.0573502 123.04164553 71.64130783 125.09008789 75.34228516 C142.57444163 107.1672303 146.43820198 144.12204361 136.35009766 179.06201172 C132.9522205 190.14988922 127.67822169 200.27441688 122.08056641 210.38232422 C120.57587875 213.04850048 120.57587875 213.04850048 119.66259766 216.06201172 C136.76619483 209.84533354 151.93306169 194.08150786 165.74707031 182.64550781 C170.03704544 179.09914295 174.35209072 175.58336431 178.66259766 172.06201172 C180.49604802 170.56215476 182.32937937 169.06215232 184.16259766 167.56201172 C187.82926432 164.56201172 191.49593099 161.56201172 195.16259766 158.56201172 C196.05978516 157.82724609 196.95697266 157.09248047 197.88134766 156.33544922 C199.81609773 154.75395407 201.75382284 153.17609437 203.69384766 151.60107422 C204.67353516 150.80443359 205.65322266 150.00779297 206.66259766 149.18701172 C207.99291016 148.10806641 207.99291016 148.10806641 209.35009766 147.00732422 C210.49478516 146.04439453 210.49478516 146.04439453 211.66259766 145.06201172 C212.28134766 144.58505859 212.90009766 144.10810547 213.53759766 143.61669922 C214.9035215 142.05529877 214.9035215 142.05529877 214.62744141 139.64404297 C213.40957294 136.3848889 211.86561288 135.0028063 209.22509766 132.74951172 C207.85417969 131.57195312 207.85417969 131.57195312 206.45556641 130.37060547 C203.1817822 127.66458244 199.89165712 124.98584446 196.55712891 122.35498047 C192.92163177 119.47503874 189.32283596 116.55139987 185.72509766 113.62451172 C185.0294873 113.05893555 184.33387695 112.49335938 183.6171875 111.91064453 C179.79392942 108.80059361 175.97548046 105.68477999 172.16259766 102.56201172 C170.32938697 101.06186183 168.49604108 99.56187716 166.66259766 98.06201172 C166.06479492 97.5723291 165.46699219 97.08264648 164.85107422 96.578125 C153.35085772 87.16443359 141.88982258 77.78539312 129.53759766 69.49951172 C128.89749756 69.06936768 128.25739746 68.63922363 127.59790039 68.19604492 C124.97016549 66.46104123 122.6642979 65.06257847 119.66259766 64.06201172 Z M-103.33740234 64.06201172 C-116.84526118 72.44619996 -129.08335906 81.93366982 -141.33740234 92.06201172 C-143.16992126 93.56300656 -145.00325903 95.06300224 -146.83740234 96.56201172 C-147.74490234 97.30451172 -148.65240234 98.04701172 -149.58740234 98.81201172 C-159.67073568 107.06201172 -169.75406901 115.31201172 -179.83740234 123.56201172 C-180.73201172 124.29806641 -181.62662109 125.03412109 -182.54833984 125.79248047 C-184.49598198 127.37732652 -186.4610784 128.94085659 -188.43896484 130.48779297 C-189.43669922 131.27541016 -190.43443359 132.06302734 -191.46240234 132.87451172 C-192.37248047 133.58220703 -193.28255859 134.28990234 -194.22021484 135.01904297 C-196.36985488 136.88722762 -196.36985488 136.88722762 -197.39208984 139.01123047 C-197.30451901 142.29513691 -195.54002927 143.73111201 -193.33740234 146.06201172 C-191.85734251 147.36003211 -190.33393391 148.60999067 -188.77490234 149.81201172 C-185.11705399 152.67071138 -181.48823622 155.55378778 -177.89990234 158.49951172 C-176.98337891 159.25103516 -176.06685547 160.00255859 -175.12255859 160.77685547 C-174.20345703 161.53095703 -173.28435547 162.28505859 -172.33740234 163.06201172 C-170.50430073 164.56229488 -168.67096807 166.0622958 -166.83740234 167.56201172 C-161.33740234 172.06201172 -161.33740234 172.06201172 -155.83740234 176.56201172 C-154.92345703 177.30966797 -154.00951172 178.05732422 -153.06787109 178.82763672 C-151.29917439 180.27498223 -149.53091691 181.72286473 -147.76318359 183.17138672 C-145.97492859 184.63620547 -144.18445459 186.09831831 -142.39208984 187.55810547 C-140.15567775 189.39127702 -137.93426682 191.23743389 -135.72021484 193.09716797 C-120.25472043 206.62277069 -120.25472043 206.62277069 -102.33740234 216.06201172 C-103.57514118 212.73631159 -104.99343745 209.94195925 -106.96240234 206.99951172 C-124.7740843 177.70627988 -128.47837418 140.72656748 -120.80126953 107.75976562 C-117.2438635 93.6622386 -111.8096713 80.73652469 -103.77880859 68.60888672 C-103.0653125 67.34818359 -103.0653125 67.34818359 -102.33740234 66.06201172 C-102.83240234 65.07201172 -102.83240234 65.07201172 -103.33740234 64.06201172 Z " transform="translate(247.33740234375,115.93798828125)"/>
    <path class="svgIconPath" d="M0 0 C0.95003906 -0.00773438 1.90007812 -0.01546875 2.87890625 -0.0234375 C8.27009539 -0.00848275 12.77883699 0.47128382 17.875 2.25 C17.35099609 3.37148437 17.35099609 3.37148437 16.81640625 4.515625 C16.36136719 5.50046875 15.90632813 6.4853125 15.4375 7.5 C14.98503906 8.47453125 14.53257812 9.4490625 14.06640625 10.453125 C10.42941225 18.99111746 11.57954082 26.79022818 14.875 35.25 C18.96468602 42.97496248 25.6630053 48.46102067 33.875 51.25 C44.08223323 54.12896322 52.7769932 50.9690596 61.875 46.25 C63.93838201 52.20996797 64.22504979 57.65595669 64.1875 63.9375 C64.18186035 64.91702637 64.1762207 65.89655273 64.17041016 66.90576172 C63.87154828 84.73390823 56.99490928 98.45277396 44.890625 111.3671875 C40.53098316 115.57932266 35.78783986 118.66898975 30.5 121.5625 C29.6181604 122.05097412 29.6181604 122.05097412 28.71850586 122.54931641 C19.68229709 127.25142153 10.54235236 128.77460078 0.4375 128.625 C-0.573125 128.61339844 -1.58375 128.60179687 -2.625 128.58984375 C-20.18276083 128.20470577 -35.13667925 121.52310878 -47.53515625 109.10546875 C-61.71385389 93.47254571 -64.94811279 76.21750037 -64.26416016 55.88085938 C-63.43195871 40.14787195 -54.48043985 25.73861238 -43.125 15.25 C-30.46762676 4.60957404 -16.30600591 -0.13383863 0 0 Z " transform="translate(256.125,191.75)"/>`,

    EyeClosed: `<path class="svgIconPath" d="M0 0 C2.3125 2.10546875 2.3125 2.10546875 5 5 C6.1015158 6.16280466 7.20308131 7.32556222 8.3046875 8.48828125 C9.49593809 9.76194956 10.68600587 11.03672499 11.875 12.3125 C12.80916748 13.31216797 12.80916748 13.31216797 13.76220703 14.33203125 C16.86854239 17.66716876 19.92521503 21.02444317 22.875 24.5 C26.2589912 28.4116928 30.04752745 31.67648037 34 35 C34.92425781 35.81210938 35.84851563 36.62421875 36.80078125 37.4609375 C50.67185583 49.58734799 65.63394879 59.56190997 82 68 C82.74443359 68.38784668 83.48886719 68.77569336 84.25585938 69.17529297 C137.36364464 96.54393339 200.21173017 99.32145747 256.89648438 82.12109375 C288.63651956 71.91657304 316.93076141 54.52107525 341.09375 31.71875 C343.47379805 29.49225344 345.88813685 27.35426882 348.375 25.25 C353.3055855 20.96655384 357.38380038 16.05555486 361.4140625 10.9296875 C361.84154785 10.39432373 362.2690332 9.85895996 362.70947266 9.30737305 C363.94266701 7.75946451 365.15926549 6.19837772 366.375 4.63671875 C369.87223201 1.1238741 373.2215454 -0.69235105 378.2578125 -1.25 C383.30059305 -0.57481599 385.7048164 0.90598402 389 5 C390.90963875 8.81927749 390.69948469 12.85689838 390 17 C388.17656222 20.47119551 385.66370281 23.14402286 383 26 C381.87078125 27.28583984 381.87078125 27.28583984 380.71875 28.59765625 C374.89025849 35.13672003 368.74241891 41.35657602 362.5625 47.5625 C361.78092529 48.34874756 360.99935059 49.13499512 360.1940918 49.94506836 C359.45070557 50.68635986 358.70731934 51.42765137 357.94140625 52.19140625 C356.94669312 53.18442749 356.94669312 53.18442749 355.93188477 54.19750977 C354.04503426 55.95798206 352.09312857 57.4937517 350 59 C351.62836415 65.18156073 354.94225474 70.3111031 358.1875 75.75 C359.45517803 77.89669214 360.72207751 80.04384419 361.98828125 82.19140625 C362.64650879 83.30531738 363.30473633 84.41922852 363.98291016 85.56689453 C367.32186466 91.24982581 370.59456263 96.97066352 373.875 102.6875 C378.34683865 110.46986146 382.86535158 118.20153809 387.6796875 125.77734375 C390.54799278 130.6059405 390.63805763 135.52843728 390 141 C387.95835443 144.49996383 385.90910064 146.80555258 382 148 C377.02463645 148.4814868 373.87994917 148.63737988 369.64697266 145.61572266 C365.74547122 141.78824912 363.30208579 136.7127588 360.625 132 C359.93019553 130.79994667 359.2342099 129.6005765 358.53710938 128.40185547 C356.70995617 125.25096116 354.90044258 122.0903391 353.09729004 118.92565918 C352.00915738 117.01607049 350.91855584 115.10791397 349.82714844 113.20019531 C344.12333371 103.22736988 344.12333371 103.22736988 341.58056641 98.73046875 C337.22291459 91.04143612 332.67758021 83.49734358 328 76 C326.89785156 76.68964844 325.79570312 77.37929688 324.66015625 78.08984375 C273.32394248 110 273.32394248 110 253 110 C253.15913628 110.864188 253.15913628 110.864188 253.32148743 111.74583435 C254.44188217 117.83082518 255.56139002 123.91597874 256.68041992 130.0012207 C257.09621556 132.26167785 257.51222519 134.52209564 257.9284668 136.7824707 C261.90478008 158.37705774 261.90478008 158.37705774 263.765625 168.7734375 C263.99668945 170.06040527 264.22775391 171.34737305 264.46582031 172.67333984 C265.39387745 178.45291321 265.99299036 182.93763541 263.375 188.375 C260.65750127 191.37855123 258.85562442 192.7395074 255 194 C250.91101553 194.19280084 247.82484174 193.42158578 244.1875 191.5625 C238.27370776 184.63491481 237.80452463 173.20317656 236.30078125 164.53125 C236.05891876 163.16019488 235.81657501 161.78922458 235.57377625 160.41833496 C235.07022269 157.56824885 234.57050668 154.71752856 234.07397461 151.86621094 C233.43706951 148.20903052 232.7933802 144.55308662 232.14722919 140.8975296 C231.52944876 137.40083973 230.91498296 133.90356994 230.30078125 130.40625 C230.18352503 129.74021255 230.06626881 129.07417511 229.94545937 128.38795471 C229.61585515 126.51221358 229.28893939 124.63600063 228.9621582 122.75976562 C228.775793 121.69294556 228.5894278 120.62612549 228.39741516 119.52697754 C228 117 228 117 228 115 C225.98177083 115.48828125 223.96354167 115.9765625 221.9453125 116.46484375 C214.19509724 117.87303936 206.41895148 118.15826314 198.55859375 118.16796875 C197.10876854 118.17296135 197.10876854 118.17296135 195.62965393 118.17805481 C193.59514842 118.18308531 191.56063477 118.18546434 189.52612305 118.18530273 C186.46974498 118.18747706 183.41373576 118.20564136 180.35742188 118.22460938 C152.90851979 118.30283993 152.90851979 118.30283993 143 115 C142.92903862 116.06627876 142.92903862 116.06627876 142.85664368 117.15409851 C142.27681274 124.99093749 141.19351837 132.65416739 139.85546875 140.39453125 C139.64440994 141.62612473 139.43335114 142.8577182 139.21589661 144.12663269 C138.77076149 146.70951434 138.32269844 149.29189296 137.87182617 151.8737793 C137.41420754 154.50765777 136.96176967 157.1416886 136.51928711 159.77807617 C135.87391955 163.6110024 135.21067881 167.44044154 134.54296875 171.26953125 C134.34801315 172.44256302 134.15305756 173.61559479 133.95219421 174.82417297 C132.84998911 180.99947327 131.70502945 185.88168003 128 191 C124.23346358 193.2741352 121.83147887 194 117.4375 194 C113.1132124 192.74202543 111.20658706 191.13023975 108 188 C104.16243247 180.32486494 107.92602095 168.40469089 109.40625 160.46875 C109.65378471 159.10176802 109.90039027 157.7346175 110.14611816 156.36730957 C110.78888041 152.80290074 111.44256595 149.24059036 112.09918213 145.67871094 C113.15277459 139.95173721 114.18863553 134.2215234 115.22599792 128.49159241 C115.58854906 126.49735809 115.9553183 124.50393703 116.32287598 122.51062012 C116.54310425 121.3050647 116.76333252 120.09950928 116.99023438 118.85742188 C117.18564819 117.79583862 117.38106201 116.73425537 117.58239746 115.64050293 C118.07810556 112.95169173 118.07810556 112.95169173 118 110 C117.030625 109.70867187 116.06125 109.41734375 115.0625 109.1171875 C89.60225214 101.3773492 66.19350269 90.79566846 44 76 C38.59437311 84.66592343 33.40881096 93.42409433 28.375 102.3125 C26.98204745 104.76001522 25.58673073 107.20618016 24.19140625 109.65234375 C23.84279037 110.26382263 23.4941745 110.87530151 23.13499451 111.50531006 C19.54322258 117.80433288 15.9407938 124.09691088 12.3125 130.375 C11.74901855 131.36024658 11.18553711 132.34549316 10.60498047 133.3605957 C3.3876587 145.80617065 3.3876587 145.80617065 -1 148 C-5.50578601 148.41469181 -9.65938461 148.48490344 -13.9375 146.9375 C-16.84140413 144.20959006 -17.85809719 141.8063427 -19 138 C-18.72986699 131.72519607 -16.370096 127.37121111 -13.3125 122.0625 C-12.82555664 121.1977002 -12.33861328 120.33290039 -11.83691406 119.44189453 C-10.23975036 116.61896548 -8.62330611 113.80797115 -7 111 C-6.45585449 110.05850098 -5.91170898 109.11700195 -5.35107422 108.14697266 C-3.65511936 105.2203952 -1.95383597 102.29699571 -0.25 99.375 C0.32387451 98.39055908 0.89774902 97.40611816 1.48901367 96.3918457 C4.36925036 91.46294815 7.26682699 86.54584577 10.20758057 81.65286255 C11.63617337 79.26999344 13.05201661 76.87969277 14.46594238 74.48809814 C15.48373106 72.77734569 16.51860049 71.07679249 17.55371094 69.37646484 C18.16504883 68.3395752 18.77638672 67.30268555 19.40625 66.234375 C19.95603516 65.31881836 20.50582031 64.40326172 21.07226562 63.45996094 C22.25266591 61.07485155 22.25266591 61.07485155 21.38134766 58.86962891 C19.9028478 56.86850626 18.41641624 55.42843622 16.4921875 53.8515625 C-15.65899329 26.60209534 -15.65899329 26.60209534 -18.69140625 14.1640625 C-18.86270991 10.39538202 -18.21594115 7.59701377 -16.9375 4.0625 C-12.47436933 -0.68857459 -6.09397114 -2.48538431 0 0 Z " transform="translate(70,198)"/>`
};

// Tabs in the "Trends Over Time" page
export const TrendsOverTimeTabs = {
    ByFood: "ByFood",
    ByMicroorganism: "ByMicroorganism"
}

// Tabs in the "Overview" page
export const OverviewTabs = {
    ByMicroorganism: "ByMicroorganism",
    ByFood: "ByFood",
    ByOrg: "ByOrg"
}

// All tabs on the app
export const Tabs = {};
Tabs[Pages.TrendsOverTime] = TrendsOverTimeTabs;
Tabs[Pages.Overview] = OverviewTabs;

// Inputs available
export const Inputs = {
    DataType: "DataType",
    FoodGroup: "FoodGroup",
    Food: "Food",
    MicroOrganism: "Microorganism",
    SurveyType: "SurveyType",
    NumberView: "NumberView",
    Year: "Year"
};

// Further groups the data for each tab apart from the grouping based on the tabs inputs
export const GroupNames = {
    SampleCode: "Sample Code"
}

// order for the filter inputs for each tab
export const FilterOrder = {};
FilterOrder[Pages.TrendsOverTime] = {};
FilterOrder[Pages.Overview] = {};
FilterOrder[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = [Inputs.DataType, Inputs.SurveyType, Inputs.MicroOrganism, Inputs.FoodGroup, Inputs.Food];
FilterOrder[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = [Inputs.DataType, Inputs.SurveyType, Inputs.FoodGroup, Inputs.Food, Inputs.MicroOrganism];
FilterOrder[Pages.Overview][OverviewTabs.ByMicroorganism] = [Inputs.MicroOrganism, Inputs.SurveyType];
FilterOrder[Pages.Overview][OverviewTabs.ByFood] = [Inputs.FoodGroup, Inputs.Food, Inputs.SurveyType];
FilterOrder[Pages.Overview][OverviewTabs.ByOrg] = [Inputs.SurveyType];

// indices for the order of the filter inputs in each tab
export const FilterOrderInds = {};
for (const page in FilterOrder) {
    const pageInputOrders = FilterOrder[page];
    FilterOrderInds[page] = {};

    for (const tab in pageInputOrders) {
        const tabInputOrder = pageInputOrders[tab];
        const tabOrderInds = {};
        tabInputOrder.forEach((input, ind) => {tabOrderInds[input] = ind});
        FilterOrderInds[page][tab] = tabOrderInds;
    }
}

// available inputs for each tab
export const TabInputs = {};
TabInputs[Pages.TrendsOverTime] = {};
TabInputs[Pages.Overview] = {};
TabInputs[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = new Set(FilterOrder[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism]);
TabInputs[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = new Set(FilterOrder[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood]);
TabInputs[Pages.Overview][OverviewTabs.ByMicroorganism] = new Set(FilterOrder[Pages.Overview][OverviewTabs.ByMicroorganism].concat([Inputs.Year]));
TabInputs[Pages.Overview][OverviewTabs.ByFood] = new Set(FilterOrder[Pages.Overview][OverviewTabs.ByFood].concat([Inputs.Year]));
TabInputs[Pages.Overview][OverviewTabs.ByOrg] = new Set(FilterOrder[Pages.Overview][OverviewTabs.ByOrg].concat([Inputs.Year]));

// Default selected pages and tabs
export const DefaultPage = Pages.Overview;
export const DefaultTrendsOverTimeSection = TrendsOverTimeTabs.ByMicroorganism;
export const DefaultOverviewSection = OverviewTabs.ByMicroorganism;

export const DefaultTabs = {};
DefaultTabs[Pages.TrendsOverTime] = DefaultTrendsOverTimeSection;
DefaultTabs[Pages.Overview] = DefaultOverviewSection;

// Available Languages
export const Languages = {
    English: "en",
    French: "fr"
}

export const DefaultLanguage = Languages.English;

// Data types available for the "select Data Type" filter
export const MicroBioDataTypes = {
    "PresenceAbsence": "presenceAbsence",
    "Concentration": "concentration"
};

// Survey Types
export const SurveyTypes = {
    HC: "HC Targeted Surveys",
    PHAC: "PHAC FoodNet",
    CFIA: "CFIA Surveys",
    CFSIN: "CFSIN"
};

// Delimeter for joining each node in the Phylogentic tree
export const PhylogeneticDelim = "==>"
export const TablePhylogenticDelim = " > "

// the timezones used for each type of data
// See the link below for all the available timezones in Moment.js
// https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a
export const DefaultDataTimeZone = "America/Toronto";
export const ModelTimeZone = "UTC";
export const TimeZone = {};
TimeZone[SurveyTypes.HC] = DefaultDataTimeZone;
TimeZone[SurveyTypes.HC] = DefaultDataTimeZone;
TimeZone[SurveyTypes.HC] = DefaultDataTimeZone;
TimeZone[SurveyTypes.HC] = DefaultDataTimeZone;

// Columns in the Health Canada Data
// Note: Copy the exact column names from "CANLINE Micro -no... .csv" except for the Columns with 3 stars (***)
export const HCDataCols = {
    Agent: "Agent",
    Genus: "Genus",
    Species: "Species",
    Subspecies: "Subspecies/Genogroup",
    Genotype: "Genotype",
    Subgenotype: "Subgenotype",
    Serotype: "Serotype",
    OtherTyping: "Other typing",
    FoodGroup: "Food Group",
    FoodName: "Food Name",
    ProjectCode: "Project Code",
    SampleCode: "Sample Code",
    QualitativeResult: "Qualitative Result",
    QuantitativeOperator: "Quantitative Result Operator",
    QuantitativeResult: "Quantitative Result",
    QuantitativeUnit: "Quantitative Result Unit",
    IsolateCode: "Isolate Code",
    SampleDate: "Sample Collection Date",
    SurveyType: "Survey Type", // ***
    Microorganism: "Microorganism", // ***
}

// Different types of operators for the quantitative results
export const QuantitativeOps = {
    Eq: "=",
    Lt: "<",
    Gt: ">",
    Le: "<=",
    Ge: ">=",
    Approx: "~"
}

// Different states for a sample
export const SampleState = {
    Detected: "detected",
    NotDetected: "not detected",
    NotTested: "not tested",
    InConclusive: "inconclusive"
}

// order to display the states of the samples in the graph
export const SampleStateOrdering = {};
SampleStateOrdering[SampleState.Detected] = 0;
SampleStateOrdering[SampleState.NotDetected] = 1;
SampleStateOrdering[SampleState.NotTested] = 2;

export const SampleStateOrder = Object.values(SampleState).sort((state1, state2) => SampleStateOrdering[state1] - SampleStateOrdering[state2]);

// colour variables for the states
export const SampleStateColours = {};
SampleStateColours[SampleState.Detected] = "var(--detected)";
SampleStateColours[SampleState.NotDetected] = "var(--notDetected)";
SampleStateColours[SampleState.NotTested] = "var(--notTested)";

// Attributes names for the summary data
export const SummaryAtts = {
    FoodName: "foodName",
    Microorganism: "microorganism",
    Samples: "samples",
    Detected: SampleState.Detected,
    NotTested: SampleState.NotTested,
    NotDetected: SampleState.NotDetected,
    Tested: "tested",
    PercentDetected: "percentDetected",
    State: "state",
    StateVal: "stateVal",
    SamplesWithConcentration: "samplesWithConcentrations",
    ConcentrationMean: "concentrationMean",
    ConcentrationRange: "concentrationRange"
}

// DefaultDims: Default dimensions used for certain dimension attributes
export const DefaultDims = {
    fontSize: 12,
    paddingSize: 5,
    pos: 0,
    length: 0,
    borderWidth: 3,
    lineSpacing: 1
};

// Dims: Dimensions used in the visuals
export const Dims = {
    overviewBarGraph: {
        HeadingFontSize: 28,
        AxesFontSize: 20,
        TickFontSize: 14,
        GraphWidth: 900,
        GraphTop: 120,
        GraphBottom: 60,
        GraphLeft: 220,
        GraphRight: 200,
        BarHeight: 60,
        YAxisTickNameWidth: 140,
        LegendSquareSize: 12,
        LegendLeftMargin: 50,
        LegendFontSize: 12
    }
}

// text wrap attributes
export const TextWrap  = {
    NoWrap: "No Wrap",
    Wrap: "Wrap"
};

// Overall display of the data
export const NumberView = {
    Number: "number",
    Percentage: "percentage"
};

// ############################################################
// ################## THEMES ##################################

export const ThemeNames = {
    Light: "light",
    Dark: "dark",
    Blue: "blue"
}

export const DefaultTheme = ThemeNames.Light;

export const Themes = {};


// Note: we base the colour theme from Android's Material UI
// https://m2.material.io/develop/android/theming/color
// https://m2.material.io/design/color/the-color-system.html

// See here for Infobase's colour scheme: https://design-system.alpha.canada.ca/en/styles/colour/
Themes[ThemeNames.Light] = {
    fontColour: "#333333",
    background: "#ffffff",
    surface: "#ffffff",
    secondarySurface: "#fbfcf8",
    error: "#ff0000",
    onBackground: "#000000",
    onSurface: "#000000",
    onSecondarySurface: "#000000",
    onError: "#ffffff",
    primary: "#26374a",
    primaryVariant: "#3B4B5C",
    onPrimary: "#ffffff",
    primaryBorderColour: "#7D828B",
    primaryHover: "#444444",
    onPrimaryHover: "#ffffff",
    secondary: "#335075",
    onSecondary: "#ffffff",
    secondaryHover: "#753350",
    onSecondaryHover: "#d8dadd",
    secondaryBorderColour: "#bbbfc5",
    tertiary: "#d7faff",
    tertiaryBorderColour: "#269abc",
    onTertiary: "#333333",
    link: "#284162",
    headerTitleColor: "#000000",

    detected: "#C5705D",
    notDetected: "#41B3A2",
    notTested: "#cc9900",
    unknown: "#cccccc"
};

Themes[ThemeNames.Dark] = {
    fontColour: "#ffffff",
    background: "#120E0B",
    surface: "#191919",
    secondarySurface: "#252525",
    error: "#ff0000",
    onBackground: "#ffffff",
    onSurface: "#ffffff",
    onSecondarySurface: "#ffffff",
    onError: "#ffffff",
    primary: "#515F6E",
    primaryVariant: "#626f7c",
    onPrimary: "#ffffff",
    primaryBorderColour: "#d6d8db",
    primaryHover: "#7c7c7c",
    onPrimaryHover: "#ffffff",
    secondary: "#5781b6",
    onSecondary: "#ffffff",
    secondaryHover: "#b65781",
    onSecondaryHover: "#d8dadd",
    secondaryBorderColour: "#d6d8db",
    tertiary: "#d7faff",
    tertiaryBorderColour: "#269abc",
    onTertiary: "#333333",
    link: "#3e6598",
    headerTitleColor: "#ffffff",

    detected: "#C5705D",
    notDetected: "#41B3A2",
    notTested: "#cc9900",
    unknown: "#cccccc"
};

// Primary ---> Mountain Haze Theme: https://www.canva.com/colors/color-palettes/mountain-haze/
// Secondary --> Mermaid Lagoon Theme: https://www.canva.com/colors/color-palettes/mermaid-lagoon/
Themes[ThemeNames.Blue] = {
    fontColour: "#333333",
    background: "#ffffff",
    surface: "#ffffff",
    secondarySurface: "#fbfcf8",
    error: "#ff0000",
    onBackground: "#000000",
    onSurface: "#000000",
    onSecondarySurface: "#000000",
    onError: "#ffffff",
    primary: "#738fa7",
    primaryVariant: "#678096",
    onPrimary: "#ffffff",
    primaryBorderColour: "#7D828B",
    primaryHover: "#0c4160",
    onPrimaryHover: "#ffffff",
    secondary: "#0c2d48",
    onSecondary: "#b1d4e0",
    secondaryHover: "#2e8bc0",
    onSecondaryHover: "#c0dce6",
    secondaryBorderColour: "#145da0",
    tertiary: "#abacca",
    tertiaryBorderColour: "#7375a7",
    onTertiary: "#ffffff",
    link: "#284162",
    headerTitleColor: "#333333",

    detected: "#cc6600",
    notDetected: "#009999",
    notTested: "#666699",
    unknown: "#cccccc"
};

// ############################################################
// ################## TRANSLATIONS ############################


const REMPLACER_MOI = "REMPLACER MOI"
const REMPLACER_MOI_AVEC_ARGUMENTS = `${REMPLACER_MOI} - les arguments du texte: `

// ============== ENGLISH =======================

// names for the main navigation pages
const NavigationEN = {};
NavigationEN[Pages.Home] = "Home";
NavigationEN[Pages.TrendsOverTime] = "Trends Over Time";
NavigationEN[Pages.Overview] = "Overview";
NavigationEN[Pages.About] = "About";
NavigationEN[Pages.Contact] = "Contact";

// names for colour themes
const ColourThemesEN = {};
ColourThemesEN[ThemeNames.Light] = "Light"
ColourThemesEN[ThemeNames.Dark] = "Dark"
ColourThemesEN[ThemeNames.Blue] = "Blue"

// names for the "Trends Over Time" sections
const TrendsOverTimeTabsEN = {};
TrendsOverTimeTabsEN[TrendsOverTimeTabs.ByFood] = "By Food";
TrendsOverTimeTabsEN[TrendsOverTimeTabs.ByMicroorganism] = "By Microorganism";

// names for the "Overview" sections
const OverviewTabsEN = {};
OverviewTabsEN[OverviewTabs.ByFood] = "By Food";
OverviewTabsEN[OverviewTabs.ByMicroorganism] = "By Microorganism";
OverviewTabsEN[OverviewTabs.ByOrg] = "By Org";

// names for the filters
const FilterNamesEN = {};
FilterNamesEN[Pages.TrendsOverTime] = {};
FilterNamesEN[Pages.Overview] = {};
Object.keys(TrendsOverTimeTabs).forEach((section) => { FilterNamesEN[Pages.TrendsOverTime][section] = {} });
Object.keys(OverviewTabs).forEach((section) => { FilterNamesEN[Pages.TrendsOverTime][section] = {} });

// Filter names for "Trends Over Time" ==> "By Food"
FilterNamesEN[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = {
    "dataType": "1. Select DataType",
    "surveyType": "2. Select Survey Type",
    "food": "3. Select Food(s)",
    "microorganism": "4. Select Microorganism",
    "adjustGraph": "5. Adjust Graph"
}

// Filter names for "Trends Over Time" ==> "By Microorganism"
FilterNamesEN[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = {
    "dataType": "1. Select DataType",
    "surveyType": "2. Select Survey Type",
    "microorganism": "3. Select Microorganism",
    "food": "4. Select Food(s)",
    "adjustGraph": "5. Adjust Graph"
}

// Filter names for "Overview" ==> "By Microorganism"
FilterNamesEN[Pages.Overview][OverviewTabs.ByMicroorganism] = {
    "microorganism": "1. Select Microorganism",
    "surveyType": "2. Select Survey Type",
    "year": "3. Select Year",
    "adjustGraph": "4. Adjust Graph"
}

// Filter names for "Overview" ==> "By Food"
FilterNamesEN[Pages.Overview][OverviewTabs.ByFood] = {
    "food": "1. Select Food(s)",
    "surveyType": "2. Select Survey Type",
    "year": "3. Select Year",
    "adjustGraph": "4. Adjust Graph"
}

// Filter names for "Overview" ==> "By Org"
FilterNamesEN[Pages.Overview][OverviewTabs.ByOrg] = {
    "surveyType": "1. Select Survey Type"
}

// Survey Types
const SurveyTypesEN = {};
SurveyTypesEN[SurveyTypes.HC] = "HC Targeted Surveys";
SurveyTypesEN[SurveyTypes.PHAC] = "PHAC FoodNet";
SurveyTypesEN[SurveyTypes.CFIA] = "CFIA Surveys";
SurveyTypesEN[SurveyTypes.CFSIN] = "CFSIN";

// names for the Data Types
const DataTypeNamesEN = {};
DataTypeNamesEN[MicroBioDataTypes.PresenceAbsence] = "Presence/Absence"
DataTypeNamesEN[MicroBioDataTypes.Concentration] = "Concentration"

// names for the percentage/number views
const NumberViewEn = {};
NumberViewEn[NumberView.Number] = "# positive";
NumberViewEn[NumberView.Percentage] = "% positive";

// name of the group for 'All Microorganisms' on the microroganism tree
const allMicroorganismsEN = "All Microorganisms";

// Genuses used in the Denominator calculations
// Note: Copy the exact values from the [Agent] and [Genus] column in "CANLINE Micro -no... .csv"
const denomGenusesEN = [[allMicroorganismsEN, "Bacteria", "Vibrio"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Bacteria", "Salmonella"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Bacteria", "Escherichia"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Bacteria", "Listeria"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Hepatovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Norovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Orthohepevirus"].join(PhylogeneticDelim),
                         [allMicroorganismsEN, "Virus", "Rotavirus"].join(PhylogeneticDelim)];

// Different options for the qualitative results
// Note: Copy the exact value from the "Qualitative Result" column in "CANLINE Micro -no... .csv", then convert the name to lowercase without any trailing/leading spaces
const QualitaiveResultsEN = {};
QualitaiveResultsEN[SampleState.Detected] = "detected";
QualitaiveResultsEN[SampleState.NotDetected] = "not detected";
QualitaiveResultsEN[SampleState.NotTested] = "not tested";
QualitaiveResultsEN[SampleState.InConclusive] = "inconclusive";

// labels for the x-axis of the overview bar graph
const overviewBarGraphXAxisEN = {};
overviewBarGraphXAxisEN[NumberView.Number] = "Count";
overviewBarGraphXAxisEN[NumberView.Percentage] = "Percentage";

// names for the columns on the table
const tableColsEN = {};
tableColsEN[SummaryAtts.FoodName] = "Food Name";
tableColsEN[SummaryAtts.Microorganism] = "Pathogen Branch";
tableColsEN[SummaryAtts.PercentDetected] = "% Detected";
tableColsEN[SummaryAtts.Detected] = "# Detected";
tableColsEN[SummaryAtts.Samples] = "# Samples";
tableColsEN[SummaryAtts.SamplesWithConcentration] = "# Samples with Conc. Data"
tableColsEN[SummaryAtts.ConcentrationMean] = "Conc. Mean (cfu/g)"
tableColsEN[SummaryAtts.ConcentrationRange] = "Conc. Range (cfu/g)"

// title/labels in the Overview bar graph
const overviewBarGraphEN = {};
overviewBarGraphEN[SummaryAtts.FoodName] = {
    "graphTitle": "Selected Qualitative Result by Microorganisms",
    "xAxis": overviewBarGraphXAxisEN,
    "yAxis": "Food Name"
};

overviewBarGraphEN[SummaryAtts.Microorganism] = {
    "graphTitle": "Selected Qualitative Result by Food",
    "xAxis": overviewBarGraphXAxisEN,
    "yAxis": "Microorganism"
};

const LangEN = {
    "websiteTitle": "Microbiology Tool",
    "websiteTabTitle": "FSDAT -Microbiology",
    "websiteDescription": "FSDAT -Microbiology",
    "changeLanguage": "Français",
    "changeLanguageValue": Languages.French,
    "showMenu": "Show Menu",
    "hideMenu": "Hide Menu",
    
    navigation: NavigationEN,
    themes: ColourThemesEN,
    TrendsOverTimeTabs: TrendsOverTimeTabsEN,
    OverviewTabs: OverviewTabsEN,
    filterNames: FilterNamesEN,

    "allFoodGroups": "All Food Groups",
    "allFoods": "All Foods",
    "allMicroorganisms": allMicroorganismsEN,
    "nonSpeciated": "Non Speciated",
    "selectAll": "Select All",
    "deselectAll": "Deselect All",
    "noResultsFound": "No results matched {0}",
    "noData": "No Data",

    "foodGroupLabel": "Food Groups:",
    "foodLabel": "Foods:",
    "microorganismLabel": "Microorganisms:",

    "showResultAsLabel": "Show Result As:",

    surveyTypes: SurveyTypesEN,
    dataTypes: DataTypeNamesEN,
    qualitativeResults: QualitaiveResultsEN,
    numberview: NumberViewEn,

    denomGenuses: denomGenusesEN,

    "tableTitle": "Statistical Summary",
    tableCols: tableColsEN,
    overviewBarGraph: overviewBarGraphEN,

    // reference: https://datatables.net/plug-ins/i18n/English.html
    // note:
    //  For some reason the CDN link provided in the documentation causes
    //  some errors with the datatables, so we copied the content of the
    //  translation JSON file here
    dataTable: {
        "emptyTable": "No data available in table",
        "info": "Showing _START_ to _END_ of _TOTAL_ entries",
        "infoEmpty": "Showing 0 to 0 of 0 entries",
        "infoFiltered": "(filtered from _MAX_ total entries)",
        "infoThousands": ",",
        "lengthMenu": "Show _MENU_ entries",
        "loadingRecords": "Loading...",
        "processing": "Processing...",
        "search": "Search:",
        "zeroRecords": "No matching records found",
        "thousands": ",",
        "paginate": {
            "first": "First",
            "last": "Last",
            "next": "Next",
            "previous": "Previous"
        },
        "aria": {
            "sortAscending": ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        },
        "autoFill": {
            "cancel": "Cancel",
            "fill": "Fill all cells with <i>%d</i>",
            "fillHorizontal": "Fill cells horizontally",
            "fillVertical": "Fill cells vertically"
        },
        "buttons": {
            "collection": "Collection <span class='ui-button-icon-primary ui-icon ui-icon-triangle-1-s'/>",
            "colvis": "Column Visibility",
            "colvisRestore": "Restore visibility",
            "copy": "Copy",
            "copyKeys": "Press ctrl or u2318 + C to copy the table data to your system clipboard.<br><br>To cancel, click this message or press escape.",
            "copySuccess": {
                "1": "Copied 1 row to clipboard",
                "_": "Copied %d rows to clipboard"
            },
            "copyTitle": "Copy to Clipboard",
            "csv": "CSV",
            "excel": "Excel",
            "pageLength": {
                "-1": "Show all rows",
                "_": "Show %d rows"
            },
            "pdf": "PDF",
            "print": "Print",
            "updateState": "Update",
            "stateRestore": "State %d",
            "savedStates": "Saved States",
            "renameState": "Rename",
            "removeState": "Remove",
            "removeAllStates": "Remove All States",
            "createState": "Create State"
        },
        "searchBuilder": {
            "add": "Add Condition",
            "button": {
                "0": "Search Builder",
                "_": "Search Builder (%d)"
            },
            "clearAll": "Clear All",
            "condition": "Condition",
            "conditions": {
                "date": {
                    "after": "After",
                    "before": "Before",
                    "between": "Between",
                    "empty": "Empty",
                    "equals": "Equals",
                    "not": "Not",
                    "notBetween": "Not Between",
                    "notEmpty": "Not Empty"
                },
                "number": {
                    "between": "Between",
                    "empty": "Empty",
                    "equals": "Equals",
                    "gt": "Greater Than",
                    "gte": "Greater Than Equal To",
                    "lt": "Less Than",
                    "lte": "Less Than Equal To",
                    "not": "Not",
                    "notBetween": "Not Between",
                    "notEmpty": "Not Empty"
                },
                "string": {
                    "contains": "Contains",
                    "empty": "Empty",
                    "endsWith": "Ends With",
                    "equals": "Equals",
                    "not": "Not",
                    "notEmpty": "Not Empty",
                    "startsWith": "Starts With",
                    "notContains": "Does Not Contain",
                    "notStartsWith": "Does Not Start With",
                    "notEndsWith": "Does Not End With"
                },
                "array": {
                    "without": "Without",
                    "notEmpty": "Not Empty",
                    "not": "Not",
                    "contains": "Contains",
                    "empty": "Empty",
                    "equals": "Equals"
                }
            },
            "data": "Data",
            "deleteTitle": "Delete filtering rule",
            "leftTitle": "Outdent Criteria",
            "logicAnd": "And",
            "logicOr": "Or",
            "rightTitle": "Indent Criteria",
            "title": {
                "0": "Search Builder",
                "_": "Search Builder (%d)"
            },
            "value": "Value"
        },
        "searchPanes": {
            "clearMessage": "Clear All",
            "collapse": {
                "0": "SearchPanes",
                "_": "SearchPanes (%d)"
            },
            "count": "{total}",
            "countFiltered": "{shown} ({total})",
            "emptyPanes": "No SearchPanes",
            "loadMessage": "Loading SearchPanes",
            "title": "Filters Active - %d",
            "showMessage": "Show All",
            "collapseMessage": "Collapse All"
        },
        "select": {
            "cells": {
                "1": "1 cell selected",
                "_": "%d cells selected"
            },
            "columns": {
                "1": "1 column selected",
                "_": "%d columns selected"
            },
            "rows": {
                "1": "1 row selected",
                "_": "%d rows selected"
            }
        },
        "datetime": {
            "previous": "Previous",
            "next": "Next",
            "hours": "Hour",
            "minutes": "Minute",
            "seconds": "Second",
            "unknown": "-",
            "amPm": [
                "am",
                "pm"
            ],
            "weekdays": [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ],
            "months": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ]
        },
        "editor": {
            "close": "Close",
            "create": {
                "button": "New",
                "title": "Create new entry",
                "submit": "Create"
            },
            "edit": {
                "button": "Edit",
                "title": "Edit Entry",
                "submit": "Update"
            },
            "remove": {
                "button": "Delete",
                "title": "Delete",
                "submit": "Delete",
                "confirm": {
                    "1": "Are you sure you wish to delete 1 row?",
                    "_": "Are you sure you wish to delete %d rows?"
                }
            },
            "error": {
                "system": "A system error has occurred (<a target=\"\\\" rel=\"nofollow\" href=\"\\\">More information</a>)."
            },
            "multi": {
                "title": "Multiple Values",
                "info": "The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.",
                "restore": "Undo Changes",
                "noMulti": "This input can be edited individually, but not part of a group. "
            }
        },
        "stateRestore": {
            "renameTitle": "Rename State",
            "renameLabel": "New Name for %s:",
            "renameButton": "Rename",
            "removeTitle": "Remove State",
            "removeSubmit": "Remove",
            "removeJoiner": " and ",
            "removeError": "Failed to remove state.",
            "removeConfirm": "Are you sure you want to remove %s?",
            "emptyStates": "No saved states",
            "emptyError": "Name cannot be empty.",
            "duplicateError": "A state with this name already exists.",
            "creationModal": {
                "toggleLabel": "Includes:",
                "title": "Create New State",
                "select": "Select",
                "searchBuilder": "SearchBuilder",
                "search": "Search",
                "scroller": "Scroll Position",
                "paging": "Paging",
                "order": "Sorting",
                "name": "Name:",
                "columns": {
                    "visible": "Column Visibility",
                    "search": "Column Search"
                },
                "button": "Create"
            }
        }
    }
}

// ==============================================
// ============== FRENCH ========================

// names for the main navigation options
const NavigationFR = {};
NavigationFR[Pages.Home] = REMPLACER_MOI;
NavigationFR[Pages.TrendsOverTime] = REMPLACER_MOI;
NavigationFR[Pages.Overview] = REMPLACER_MOI;
NavigationFR[Pages.About] = REMPLACER_MOI;
NavigationFR[Pages.Contact] = REMPLACER_MOI;

// names for colour themes
const ColourThemesFR = {};
ColourThemesFR[ThemeNames.Light] = "Clair"
ColourThemesFR[ThemeNames.Dark] = "Foncé"
ColourThemesFR[ThemeNames.Blue] = "Bleu"

// names for the "Trends Over Time" sections
const TrendsOverTimeTabsFR = {};
TrendsOverTimeTabsFR[TrendsOverTimeTabs.ByFood] = REMPLACER_MOI;
TrendsOverTimeTabsFR[TrendsOverTimeTabs.ByMicroorganism] = REMPLACER_MOI;

// names for the "Overview" sections
const OverviewTabsFR = {};
OverviewTabsFR[OverviewTabs.ByFood] = REMPLACER_MOI;
OverviewTabsFR[OverviewTabs.ByMicroorganism] = REMPLACER_MOI;
OverviewTabsFR[OverviewTabs.ByOrg] = REMPLACER_MOI;

// names for the filters
const FilterNamesFR = {};
FilterNamesFR[Pages.TrendsOverTime] = {};
FilterNamesFR[Pages.Overview] = {};
Object.keys(TrendsOverTimeTabs).forEach((section) => { FilterNamesFR[Pages.TrendsOverTime][section] = {} });
Object.keys(OverviewTabs).forEach((section) => { FilterNamesFR[Pages.TrendsOverTime][section] = {} });

// Filter names for "Trends Over Time" ==> "By Food"
FilterNamesFR[Pages.TrendsOverTime][TrendsOverTimeTabs.ByFood] = {
    "dataType": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI,
    "food": REMPLACER_MOI,
    "microorganism": REMPLACER_MOI,
    "adjustGraph": REMPLACER_MOI
}

// Filter names for "Trends Over Time" ==> "By Microorganism"
FilterNamesFR[Pages.TrendsOverTime][TrendsOverTimeTabs.ByMicroorganism] = {
    "dataType": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI,
    "microorganism": REMPLACER_MOI,
    "food": REMPLACER_MOI,
    "adjustGraph": REMPLACER_MOI
}

// Filter names for "Overview" ==> "By Microorganism"
FilterNamesFR[Pages.Overview][OverviewTabs.ByMicroorganism] = {
    "microorganism": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI,
    "year": REMPLACER_MOI,
    "adjustGraph": REMPLACER_MOI
}

// Filter names for "Overview" ==> "By Food"
FilterNamesFR[Pages.Overview][OverviewTabs.ByFood] = {
    "food": REMPLACER_MOI,
    "surveyType": REMPLACER_MOI,
    "year": REMPLACER_MOI,
    "adjustGraph": REMPLACER_MOI
}

// Filter names for "Overview" ==> "By Org"
FilterNamesFR[Pages.Overview][OverviewTabs.ByOrg] = {
    "surveyType": REMPLACER_MOI
}

// Survey Types
const SurveyTypesFR = {};
SurveyTypesFR[SurveyTypes.HC] = REMPLACER_MOI;
SurveyTypesFR[SurveyTypes.PHAC] = REMPLACER_MOI;
SurveyTypesFR[SurveyTypes.CFIA] = REMPLACER_MOI;
SurveyTypesFR[SurveyTypes.CFSIN] = REMPLACER_MOI;

// names for the Data Types
const DataTypeNamesFR = {};
DataTypeNamesFR[MicroBioDataTypes.PresenceAbsence] = REMPLACER_MOI;
DataTypeNamesFR[MicroBioDataTypes.Concentration] = REMPLACER_MOI;

// names for the percentage/number views
const NumberViewFR = {};
NumberViewFR[NumberView.Number] = REMPLACER_MOI;
NumberViewFR[NumberView.Percentage] = REMPLACER_MOI;

// name of the group for 'All Microorganisms' on the microroganism tree
const allMicroorganismsFR = REMPLACER_MOI;

// Genuses used in the Denominator calculations
// Note: Copy the exact values from the [Agent] and [Genus] column in "CANLINE Micro -no... .csv"
const denomGenusesFR = [[allMicroorganismsFR, "Bacteria", "Vibrio"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Bacteria", "Salmonella"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Bacteria", "Escherichia"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Bacteria", "Listeria"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Hepatovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Norovirus"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Orthohepevirus"].join(PhylogeneticDelim),
                         [allMicroorganismsFR, "Virus", "Rotavirus"].join(PhylogeneticDelim)];

// Different options for the qualitative results
// Note: Copy the exact value from the "Qualitative Result" column in "CANLINE Micro -no... .csv", then convert the name to lowercase without any trailing/leading spaces
const QualitaiveResultsFR = {};
QualitaiveResultsFR[SampleState.Detected] = "detected";
QualitaiveResultsFR[SampleState.NotDetected] = "not detected";
QualitaiveResultsFR[SampleState.NotTested] = "not tested";
QualitaiveResultsFR[SampleState.InConclusive] = "inconclusive";

// labels for the x-axis of the overview bar graph
const overviewBarGraphXAxisFR = {};
overviewBarGraphXAxisFR[NumberView.Number] = REMPLACER_MOI;
overviewBarGraphXAxisFR[NumberView.Percentage] = REMPLACER_MOI;

// names for the columns on the table
const tableColsFR = {};
tableColsFR[SummaryAtts.FoodName] = REMPLACER_MOI;
tableColsFR[SummaryAtts.Microorganism] = REMPLACER_MOI;
tableColsFR[SummaryAtts.PercentDetected] = REMPLACER_MOI;
tableColsFR[SummaryAtts.Detected] = REMPLACER_MOI;
tableColsFR[SummaryAtts.Samples] = REMPLACER_MOI;
tableColsFR[SummaryAtts.SamplesWithConcentration] = REMPLACER_MOI;
tableColsFR[SummaryAtts.ConcentrationMean] = REMPLACER_MOI;
tableColsFR[SummaryAtts.ConcentrationRange] = REMPLACER_MOI;

// title/labels in the Overview bar graph
const overviewBarGraphFR = {};
overviewBarGraphFR[SummaryAtts.FoodName] = {
    "graphTitle": REMPLACER_MOI,
    "xAxis": overviewBarGraphXAxisFR,
    "yAxis": REMPLACER_MOI
};

overviewBarGraphFR[SummaryAtts.Microorganism] = {
    "graphTitle": REMPLACER_MOI,
    "xAxis": overviewBarGraphXAxisFR,
    "yAxis": REMPLACER_MOI
};

const LangFR = {
    "websiteTitle": REMPLACER_MOI,
    "websiteTabTitle": REMPLACER_MOI,
    "websiteDescription": REMPLACER_MOI,
    "changeLanguage": "English",
    "changeLanguageValue": Languages.English,
    "showMenu": REMPLACER_MOI,
    "hideMenu": REMPLACER_MOI,

    navigation: NavigationFR,
    themes: ColourThemesFR,
    TrendsOverTimeTabs: TrendsOverTimeTabsFR,
    OverviewTabs: OverviewTabsFR,
    filterNames: FilterNamesFR,

    "allFoodGroups": REMPLACER_MOI,
    "allFoods": REMPLACER_MOI,
    "allMicroorganisms": allMicroorganismsFR,
    "nonSpeciated": REMPLACER_MOI,
    "selectAll": REMPLACER_MOI,
    "deselectAll": REMPLACER_MOI,
    "noResultsFound": `${REMPLACER_MOI_AVEC_ARGUMENTS} {0}`,
    "noData": "No Data",

    "foodGroupLabel": REMPLACER_MOI,
    "foodLabel": REMPLACER_MOI,
    "microorganismLabel": REMPLACER_MOI,

    "showResultAsLabel": REMPLACER_MOI,

    surveyTypes: SurveyTypesFR,
    dataTypes: DataTypeNamesFR,
    qualitativeResults: QualitaiveResultsFR,
    denomGenuses: denomGenusesFR,
    numberview: NumberViewFR,

    "tableTitle": REMPLACER_MOI,
    tableCols: tableColsFR,
    overviewBarGraph: overviewBarGraphFR,

    // references: https://datatables.net/plug-ins/i18n/French.html
    // note:
    //  For some reason the CDN link provided in the documentation causes
    //  some errors with the datatables, so we copied the content of the
    //  translation JSON file here
    dataTable: {
        "emptyTable": "Aucune donnée disponible dans le tableau",
        "loadingRecords": "Chargement...",
        "processing": "Traitement...",
        "select": {
            "rows": {
                "1": "1 ligne sélectionnée",
                "_": "%d lignes sélectionnées"
            },
            "cells": {
                "1": "1 cellule sélectionnée",
                "_": "%d cellules sélectionnées"
            },
            "columns": {
                "1": "1 colonne sélectionnée",
                "_": "%d colonnes sélectionnées"
            }
        },
        "autoFill": {
            "cancel": "Annuler",
            "fill": "Remplir toutes les cellules avec <i>%d</i>",
            "fillHorizontal": "Remplir les cellules horizontalement",
            "fillVertical": "Remplir les cellules verticalement"
        },
        "searchBuilder": {
            "conditions": {
                "date": {
                    "after": "Après le",
                    "before": "Avant le",
                    "between": "Entre",
                    "empty": "Vide",
                    "not": "Différent de",
                    "notBetween": "Pas entre",
                    "notEmpty": "Non vide",
                    "equals": "Égal à"
                },
                "number": {
                    "between": "Entre",
                    "empty": "Vide",
                    "gt": "Supérieur à",
                    "gte": "Supérieur ou égal à",
                    "lt": "Inférieur à",
                    "lte": "Inférieur ou égal à",
                    "not": "Différent de",
                    "notBetween": "Pas entre",
                    "notEmpty": "Non vide",
                    "equals": "Égal à"
                },
                "string": {
                    "contains": "Contient",
                    "empty": "Vide",
                    "endsWith": "Se termine par",
                    "not": "Différent de",
                    "notEmpty": "Non vide",
                    "startsWith": "Commence par",
                    "equals": "Égal à",
                    "notContains": "Ne contient pas",
                    "notEndsWith": "Ne termine pas par",
                    "notStartsWith": "Ne commence pas par"
                },
                "array": {
                    "empty": "Vide",
                    "contains": "Contient",
                    "not": "Différent de",
                    "notEmpty": "Non vide",
                    "without": "Sans",
                    "equals": "Égal à"
                }
            },
            "add": "Ajouter une condition",
            "button": {
                "0": "Recherche avancée",
                "_": "Recherche avancée (%d)"
            },
            "clearAll": "Effacer tout",
            "condition": "Condition",
            "data": "Donnée",
            "deleteTitle": "Supprimer la règle de filtrage",
            "logicAnd": "Et",
            "logicOr": "Ou",
            "title": {
                "0": "Recherche avancée",
                "_": "Recherche avancée (%d)"
            },
            "value": "Valeur",
            "leftTitle": "Désindenter le critère",
            "rightTitle": "Indenter le critère"
        },
        "searchPanes": {
            "clearMessage": "Effacer tout",
            "count": "{total}",
            "title": "Filtres actifs - %d",
            "collapse": {
                "0": "Volet de recherche",
                "_": "Volet de recherche (%d)"
            },
            "countFiltered": "{shown} ({total})",
            "emptyPanes": "Pas de volet de recherche",
            "loadMessage": "Chargement du volet de recherche...",
            "collapseMessage": "Réduire tout",
            "showMessage": "Montrer tout"
        },
        "buttons": {
            "collection": "Collection",
            "colvis": "Visibilité colonnes",
            "colvisRestore": "Rétablir visibilité",
            "copy": "Copier",
            "copySuccess": {
                "1": "1 ligne copiée dans le presse-papier",
                "_": "%d lignes copiées dans le presse-papier"
            },
            "copyTitle": "Copier dans le presse-papier",
            "csv": "CSV",
            "excel": "Excel",
            "pageLength": {
                "1": "Afficher 1 ligne",
                "-1": "Afficher toutes les lignes",
                "_": "Afficher %d lignes"
            },
            "pdf": "PDF",
            "print": "Imprimer",
            "copyKeys": "Appuyez sur ctrl ou u2318 + C pour copier les données du tableau dans votre presse-papier.",
            "createState": "Créer un état",
            "removeAllStates": "Supprimer tous les états",
            "removeState": "Supprimer",
            "renameState": "Renommer",
            "savedStates": "États sauvegardés",
            "stateRestore": "État %d",
            "updateState": "Mettre à jour"
        },
        "decimal": ",",
        "datetime": {
            "previous": "Précédent",
            "next": "Suivant",
            "hours": "Heures",
            "minutes": "Minutes",
            "seconds": "Secondes",
            "unknown": "-",
            "amPm": [
                "am",
                "pm"
            ],
            "months": {
                "0": "Janvier",
                "1": "Février",
                "2": "Mars",
                "3": "Avril",
                "4": "Mai",
                "5": "Juin",
                "6": "Juillet",
                "7": "Août",
                "8": "Septembre",
                "9": "Octobre",
                "10": "Novembre",
                "11": "Décembre"
            },
            "weekdays": [
                "Dim",
                "Lun",
                "Mar",
                "Mer",
                "Jeu",
                "Ven",
                "Sam"
            ]
        },
        "editor": {
            "close": "Fermer",
            "create": {
                "title": "Créer une nouvelle entrée",
                "button": "Nouveau",
                "submit": "Créer"
            },
            "edit": {
                "button": "Editer",
                "title": "Editer Entrée",
                "submit": "Mettre à jour"
            },
            "remove": {
                "button": "Supprimer",
                "title": "Supprimer",
                "submit": "Supprimer",
                "confirm": {
                    "1": "Êtes-vous sûr de vouloir supprimer 1 ligne ?",
                    "_": "Êtes-vous sûr de vouloir supprimer %d lignes ?"
                }
            },
            "multi": {
                "title": "Valeurs multiples",
                "info": "Les éléments sélectionnés contiennent différentes valeurs pour cette entrée. Pour modifier et définir tous les éléments de cette entrée à la même valeur, cliquez ou tapez ici, sinon ils conserveront leurs valeurs individuelles.",
                "restore": "Annuler les modifications",
                "noMulti": "Ce champ peut être modifié individuellement, mais ne fait pas partie d'un groupe. "
            },
            "error": {
                "system": "Une erreur système s'est produite (<a target=\"\\\" rel=\"nofollow\" href=\"\\\">Plus d'information</a>)."
            }
        },
        "stateRestore": {
            "removeSubmit": "Supprimer",
            "creationModal": {
                "button": "Créer",
                "order": "Tri",
                "paging": "Pagination",
                "scroller": "Position du défilement",
                "search": "Recherche",
                "select": "Sélection",
                "columns": {
                    "search": "Recherche par colonne",
                    "visible": "Visibilité des colonnes"
                },
                "name": "Nom :",
                "searchBuilder": "Recherche avancée",
                "title": "Créer un nouvel état",
                "toggleLabel": "Inclus :"
            },
            "renameButton": "Renommer",
            "duplicateError": "Il existe déjà un état avec ce nom.",
            "emptyError": "Le nom ne peut pas être vide.",
            "emptyStates": "Aucun état sauvegardé",
            "removeConfirm": "Voulez vous vraiment supprimer %s ?",
            "removeError": "Échec de la suppression de l'état.",
            "removeJoiner": "et",
            "removeTitle": "Supprimer l'état",
            "renameLabel": "Nouveau nom pour %s :",
            "renameTitle": "Renommer l'état"
        },
        "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
        "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
        "infoFiltered": "(filtrées depuis un total de _MAX_ entrées)",
        "lengthMenu": "Afficher _MENU_ entrées",
        "paginate": {
            "first": "Première",
            "last": "Dernière",
            "next": "Suivante",
            "previous": "Précédente"
        },
        "zeroRecords": "Aucune entrée correspondante trouvée",
        "aria": {
            "sortAscending": " : activer pour trier la colonne par ordre croissant",
            "sortDescending": " : activer pour trier la colonne par ordre décroissant"
        },
        "infoThousands": " ",
        "search": "Rechercher :",
        "thousands": " "
    }
}

// ==============================================

export const TranslationObj = {};
TranslationObj[Languages.English] = {translation: LangEN};
TranslationObj[Languages.French] = {translation: LangFR};

// ############################################################