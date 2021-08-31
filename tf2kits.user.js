// ==UserScript==
// @name         TF 2 KITS
// @include      https://steamcommunity.com/id/*/inventory/
// @include      https://steamcommunity.com/profiles/*/inventory
// @version      2.1
// @description  Finds your fabricators and checks current buy price to get an estimate if its worth to build into a kit or not.
// @author       Zenger
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==


const INVENTORY_CACHE_TIME = 3600000; // 1 hr
const MARKET_CACHE_TIME    = 300000;  // 5 min
const REQUEST_DELAY        = 5000;
const STEAM_ID = unsafeWindow.UserYou.strSteamId || prompt(`Couldn't determine STEAM ID, please enter STEAM ID 64`);
const DEFAULT_SORT_DIRECTION = 0; // 0 ALPH DESC, 1 ALPH ASC, 2 PRICE ASC, 3 PRICE DESC

const ITEM_IDS = [{"name":"Specialized Killstreak Kit","id":"56651110"},{"name":"Professional Killstreak Axtinguisher Kit","id":"2377004"},{"name":"Professional Killstreak Manmelter Kit","id":"2404256"},{"name":"Professional Killstreak Shortstop Kit","id":"2327343"},{"name":"Professional Killstreak Lugermorph Kit","id":"6718071"},{"name":"Professional Killstreak Winger Kit","id":"2559457"},{"name":"Professional Killstreak Bat Kit","id":"2457882"},{"name":"Professional Killstreak Kukri Kit","id":"2367846"},{"name":"Professional Killstreak Gunslinger Kit","id":"2316364"},{"name":"Professional Killstreak Knife Kit","id":"2370999"},{"name":"Professional Killstreak Shotgun Kit","id":"2344948"},{"name":"Professional Killstreak Mantreads Kit","id":"4505225"},{"name":"Professional Killstreak Atomizer Kit","id":"2440381"},{"name":"Professional Killstreak Phlogistinator Kit","id":"2376134"},{"name":"Professional Killstreak Wrench Kit","id":"2350917"},{"name":"Professional Killstreak Diamondback Kit","id":"2377003"},{"name":"Professional Killstreak Bottle Kit","id":"2435030"},{"name":"Professional Killstreak Scattergun Kit","id":"2315493"},{"name":"Professional Killstreak Detonator Kit","id":"2397539"},{"name":"Professional Killstreak Tomislav Kit","id":"2347922"},{"name":"Professional Killstreak Huntsman Kit","id":"2391454"},{"name":"Professional Killstreak Eyelander Kit","id":"2443854"},{"name":"Professional Killstreak Blutsauger Kit","id":"2322055"},{"name":"Professional Killstreak Amputator Kit","id":"2428295"},{"name":"Professional Killstreak Rainblower Kit","id":"2313774"},{"name":"Professional Killstreak Widowmaker Kit","id":"2360219"},{"name":"Professional Killstreak Ambassador Kit","id":"2363677"},{"name":"Professional Killstreak Original Kit","id":"2327984"},{"name":"Professional Killstreak Kritzkrieg Kit","id":"2306510"},{"name":"Professional Killstreak Degreaser Kit","id":"2368748"},{"name":"Professional Killstreak SMG Kit","id":"2381683"},{"name":"Professional Killstreak Batsaber Kit","id":"75212794"},{"name":"Professional Killstreak Backburner Kit","id":"2439800"},{"name":"Professional Killstreak Revolver Kit","id":"2378310"},{"name":"Professional Killstreak Jag Kit","id":"2367312"},{"name":"Professional Killstreak Pistol Kit","id":"2405166"},{"name":"Professional Killstreak Machina Kit","id":"2390703"},{"name":"Professional Killstreak Bonesaw Kit","id":"2458414"},{"name":"Professional Killstreak Shahanshah Kit","id":"2499536"},{"name":"Professional Killstreak Natascha Kit","id":"2413517"},{"name":"Professional Killstreak Equalizer Kit","id":"2500419"},{"name":"Specialized Killstreak Natascha Kit","id":"2379865"},{"name":"Specialized Killstreak Lugermorph Kit","id":"6717407"},{"name":"Specialized Killstreak Jag Kit","id":"2310879"},{"name":"Specialized Killstreak Vaccinator Kit","id":"2325671"},{"name":"Specialized Killstreak Bushwacka Kit","id":"2317895"},{"name":"Specialized Killstreak Winger Kit","id":"2314878"},{"name":"Specialized Killstreak Shortstop Kit","id":"2350066"},{"name":"Specialized Killstreak Degreaser Kit","id":"2310626"},{"name":"Specialized Killstreak Homewrecker Kit","id":"2378798"},{"name":"Specialized Killstreak Backburner Kit","id":"2287908"},{"name":"Specialized Killstreak Original Kit","id":"2297431"},{"name":"Specialized Killstreak Powerjack Kit","id":"2316720"},{"name":"Specialized Killstreak Mantreads Kit","id":"2353875"},{"name":"Specialized Killstreak Axtinguisher Kit","id":"2304841"},{"name":"Specialized Killstreak Bat Kit","id":"2328033"},{"name":"Specialized Killstreak Shovel Kit","id":"2343071"},{"name":"Specialized Killstreak Enforcer Kit","id":"2396867"},{"name":"Specialized Killstreak Amputator Kit","id":"2427903"},{"name":"Specialized Killstreak Overdose Kit","id":"2320646"},{"name":"Specialized Killstreak Huntsman Kit","id":"2317933"},{"name":"Specialized Killstreak Equalizer Kit","id":"2357250"},{"name":"Professional Killstreak Southern Hospitality Kit","id":"2343099"},{"name":"Professional Killstreak Pain Train Kit","id":"2536091"},{"name":"Professional Killstreak Bread Bite Kit","id":"14564853"},{"name":"Professional Killstreak Flare Gun Kit","id":"2393948"},{"name":"Professional Killstreak Flame Thrower Kit","id":"2348976"},{"name":"Professional Killstreak AWPer Hand Kit","id":"6738835"},{"name":"Professional Killstreak Flying Guillotine Kit","id":"2556895"},{"name":"Professional Killstreak Sydney Sleeper Kit","id":"2449110"},{"name":"Professional Killstreak Freedom Staff Kit","id":"2491212"},{"name":"Professional Killstreak Claidheamh Mòr Kit","id":false},{"name":"Professional Killstreak L'Etranger Kit","id":"2369295"},{"name":"Professional Killstreak Fortified Compound Kit","id":"8284056"},{"name":"Professional Killstreak Scotsman's Skullcutter Kit","id":"2346931"},{"name":"Professional Killstreak Brass Beast Kit","id":"2392694"},{"name":"Professional Killstreak Eureka Effect Kit","id":"2434397"},{"name":"Professional Killstreak Hitman's Heatmaker Kit","id":"2350072"},{"name":"Professional Killstreak Spy-cicle Kit","id":"2350961"},{"name":"Professional Killstreak Big Earner Kit","id":"2324131"},{"name":"Professional Killstreak Persian Persuader Kit","id":"2365491"},{"name":"Professional Killstreak Eviction Notice Kit","id":"2564880"},{"name":"Professional Killstreak Vita-Saw Kit","id":"2757108"},{"name":"Professional Killstreak Ham Shank Kit","id":"2455649"},{"name":"Professional Killstreak Fists of Steel Kit","id":"2454642"},{"name":"Professional Killstreak Direct Hit Kit","id":"2362950"},{"name":"Professional Killstreak Third Degree Kit","id":"2695435"},{"name":"Professional Killstreak Unarmed Combat Kit","id":"2432415"},{"name":"Professional Killstreak Boston Basher Kit","id":"3436746"},{"name":"Professional Killstreak Splendid Screen Kit","id":"5816589"},{"name":"Professional Killstreak Tribalman's Shiv Kit","id":"2797834"},{"name":"Specialized Killstreak Kit","id":"56651110"},{"name":"Professional Killstreak Axtinguisher Kit","id":"2377004"},{"name":"Professional Killstreak Manmelter Kit","id":"2404256"},{"name":"Professional Killstreak Shortstop Kit","id":"2327343"},{"name":"Professional Killstreak Lugermorph Kit","id":"6718071"},{"name":"Professional Killstreak Winger Kit","id":"2559457"},{"name":"Professional Killstreak Bat Kit","id":"2457882"},{"name":"Professional Killstreak Kukri Kit","id":"2367846"},{"name":"Professional Killstreak Gunslinger Kit","id":"2316364"},{"name":"Professional Killstreak Knife Kit","id":"2370999"},{"name":"Professional Killstreak Shotgun Kit","id":"2344948"},{"name":"Professional Killstreak Mantreads Kit","id":"4505225"},{"name":"Professional Killstreak Atomizer Kit","id":"2440381"},{"name":"Professional Killstreak Phlogistinator Kit","id":"2376134"},{"name":"Professional Killstreak Wrench Kit","id":"2350917"},{"name":"Professional Killstreak Diamondback Kit","id":"2377003"},{"name":"Professional Killstreak Homewrecker Kit","id":"2837987"},{"name":"Professional Killstreak Powerjack Kit","id":"2392036"},{"name":"Professional Killstreak Ubersaw Kit","id":"2379340"},{"name":"Professional Killstreak Minigun Kit","id":"2317588"},{"name":"Professional Killstreak Vaccinator Kit","id":"2446352"},{"name":"Professional Killstreak Bottle Kit","id":"2435030"},{"name":"Professional Killstreak Scattergun Kit","id":"2315493"},{"name":"Professional Killstreak Detonator Kit","id":"2397539"},{"name":"Professional Killstreak Tomislav Kit","id":"2347922"},{"name":"Professional Killstreak Widowmaker Kit","id":"2360219"},{"name":"Professional Killstreak Ambassador Kit","id":"2363677"},{"name":"Professional Killstreak Original Kit","id":"2327984"},{"name":"Professional Killstreak Kritzkrieg Kit","id":"2306510"},{"name":"Professional Killstreak Degreaser Kit","id":"2368748"},{"name":"Professional Killstreak SMG Kit","id":"2381683"},{"name":"Professional Killstreak Batsaber Kit","id":"75212794"},{"name":"Professional Killstreak Backburner Kit","id":"2439800"},{"name":"Professional Killstreak Revolver Kit","id":"2378310"},{"name":"Professional Killstreak Jag Kit","id":"2367312"},{"name":"Professional Killstreak Pistol Kit","id":"2405166"},{"name":"Professional Killstreak Machina Kit","id":"2390703"},{"name":"Professional Killstreak Bonesaw Kit","id":"2458414"},{"name":"Professional Killstreak Shahanshah Kit","id":"2499536"},{"name":"Professional Killstreak Natascha Kit","id":"2413517"},{"name":"Professional Killstreak Equalizer Kit","id":"2500419"},{"name":"Professional Killstreak Lollichop Kit","id":"3452406"},{"name":"Professional Killstreak Shovel Kit","id":"2504302"},{"name":"Professional Killstreak Classic Kit","id":"14537467"},{"name":"Professional Killstreak Bushwacka Kit","id":"2378952"},{"name":"Professional Killstreak Enforcer Kit","id":"2543345"},{"name":"Professional Killstreak Overdose Kit","id":"2373596"},{"name":"Professional Killstreak Fists Kit","id":"2445178"},{"name":"Professional Killstreak Maul Kit","id":"2378307"},{"name":"Professional Killstreak Sandman Kit","id":"2364359"},{"name":"Specialized Killstreak Scattergun Kit","id":"2316301"},{"name":"Specialized Killstreak Tomislav Kit","id":"2372912"},{"name":"Specialized Killstreak Pistol Kit","id":"2313236"},{"name":"Specialized Killstreak Ubersaw Kit","id":"2289391"},{"name":"Specialized Killstreak Eyelander Kit","id":"2308092"},{"name":"Specialized Killstreak Knife Kit","id":"2307284"},{"name":"Specialized Killstreak Shahanshah Kit","id":"2316684"},{"name":"Specialized Killstreak Wrench Kit","id":"2300751"},{"name":"Specialized Killstreak Machina Kit","id":"2300737"},{"name":"Specialized Killstreak Shotgun Kit","id":"2312454"},{"name":"Specialized Killstreak Kritzkrieg Kit","id":"2260920"},{"name":"Specialized Killstreak Maul Kit","id":"2326801"},{"name":"Specialized Killstreak Gunslinger Kit","id":"2297438"},{"name":"Specialized Killstreak Diamondback Kit","id":"2368212"},{"name":"Specialized Killstreak Bonesaw Kit","id":"2388207"},{"name":"Specialized Killstreak Blutsauger Kit","id":"2346847"},{"name":"Specialized Killstreak Widowmaker Kit","id":"2310707"},{"name":"Specialized Killstreak Kukri Kit","id":"2361521"},{"name":"Specialized Killstreak Bottle Kit","id":"2315014"},{"name":"Specialized Killstreak Phlogistinator Kit","id":"2320372"},{"name":"Specialized Killstreak Fists Kit","id":"2390444"},{"name":"Specialized Killstreak Natascha Kit","id":"2379865"},{"name":"Specialized Killstreak Lugermorph Kit","id":"6717407"},{"name":"Specialized Killstreak Jag Kit","id":"2310879"},{"name":"Specialized Killstreak Vaccinator Kit","id":"2325671"},{"name":"Specialized Killstreak Original Kit","id":"2297431"},{"name":"Specialized Killstreak Powerjack Kit","id":"2316720"},{"name":"Specialized Killstreak Mantreads Kit","id":"2353875"},{"name":"Specialized Killstreak Axtinguisher Kit","id":"2304841"},{"name":"Specialized Killstreak Bat Kit","id":"2328033"},{"name":"Specialized Killstreak Shovel Kit","id":"2343071"},{"name":"Specialized Killstreak Enforcer Kit","id":"2396867"},{"name":"Specialized Killstreak Amputator Kit","id":"2427903"},{"name":"Specialized Killstreak Overdose Kit","id":"2320646"},{"name":"Specialized Killstreak Huntsman Kit","id":"2317933"},{"name":"Specialized Killstreak Equalizer Kit","id":"2357250"},{"name":"Professional Killstreak Southern Hospitality Kit","id":"2343099"},{"name":"Professional Killstreak Pain Train Kit","id":"2536091"},{"name":"Professional Killstreak Bread Bite Kit","id":"14564853"},{"name":"Professional Killstreak Flare Gun Kit","id":"2393948"},{"name":"Professional Killstreak Black Box Kit","id":"2410261"},{"name":"Professional Killstreak Air Strike Kit","id":"14515317"},{"name":"Professional Killstreak Rocket Launcher Kit","id":"2262261"},{"name":"Professional Killstreak Escape Plan Kit","id":"2457311"},{"name":"Professional Killstreak Scottish Resistance Kit","id":"2427512"},{"name":"Professional Killstreak Tide Turner Kit","id":"14515309"},{"name":"Professional Killstreak Crusader's Crossbow Kit","id":"2317572"},{"name":"Professional Killstreak Chargin' Targe Kit","id":"2387672"},{"name":"Professional Killstreak Syringe Gun Kit","id":"2385192"},{"name":"Professional Killstreak Neon Annihilator Kit","id":"2558568"},{"name":"Professional Killstreak Back Scatter Kit","id":"14658967"},{"name":"Professional Killstreak Liberty Launcher Kit","id":"2365942"},{"name":"Professional Killstreak Soda Popper Kit","id":"2490159"},{"name":"Professional Killstreak Rescue Ranger Kit","id":"2414000"},{"name":"Professional Killstreak Force-A-Nature Kit","id":"2316404"},{"name":"Professional Killstreak Panic Attack Kit","id":"28313033"},{"name":"Professional Killstreak Holiday Punch Kit","id":"2446778"},{"name":"Professional Killstreak Black Rose Kit","id":"6715419"},{"name":"Professional Killstreak Quickiebomb Launcher Kit","id":"27730381"},{"name":"Professional Killstreak Conniver's Kunai Kit","id":"2449658"},{"name":"Professional Killstreak Hot Hand Kit","id":"175977321"},{"name":"Professional Killstreak Quick-Fix Kit","id":"2438235"},{"name":"Professional Killstreak Frontier Justice Kit","id":"2381678"},{"name":"Professional Killstreak Warrior's Spirit Kit","id":"2685825"},{"name":"Professional Killstreak Beggar's Bazooka Kit","id":"2410117"},{"name":"Professional Killstreak Medi Gun Kit","id":"2355093"},{"name":"Professional Killstreak Scorch Shot Kit","id":"2391887"},{"name":"Professional Killstreak Iron Bomber Kit","id":"27964242"},{"name":"Professional Killstreak Half-Zatoichi Kit","id":"2407181"},{"name":"Professional Killstreak Flame Thrower Kit","id":"2348976"},{"name":"Professional Killstreak AWPer Hand Kit","id":"6738835"},{"name":"Professional Killstreak Flying Guillotine Kit","id":"2556895"},{"name":"Professional Killstreak Sydney Sleeper Kit","id":"2449110"},{"name":"Professional Killstreak Freedom Staff Kit","id":"2491212"},{"name":"Professional Killstreak Claidheamh Mòr Kit","id":false},{"name":"Professional Killstreak Hitman's Heatmaker Kit","id":"2350072"},{"name":"Professional Killstreak Spy-cicle Kit","id":"2350961"},{"name":"Professional Killstreak Big Earner Kit","id":"2324131"},{"name":"Professional Killstreak Persian Persuader Kit","id":"2365491"},{"name":"Professional Killstreak Eviction Notice Kit","id":"2564880"},{"name":"Professional Killstreak Vita-Saw Kit","id":"2757108"},{"name":"Professional Killstreak Ham Shank Kit","id":"2455649"},{"name":"Professional Killstreak Fists of Steel Kit","id":"2454642"},{"name":"Professional Killstreak Direct Hit Kit","id":"2362950"},{"name":"Professional Killstreak Third Degree Kit","id":"2695435"},{"name":"Professional Killstreak Unarmed Combat Kit","id":"2432415"},{"name":"Professional Killstreak Boston Basher Kit","id":"3436746"},{"name":"Professional Killstreak Splendid Screen Kit","id":"5816589"},{"name":"Professional Killstreak Tribalman's Shiv Kit","id":"2797834"},{"name":"Professional Killstreak Righteous Bison Kit","id":"2301219"},{"name":"Professional Killstreak Short Circuit Kit","id":"2444480"},{"name":"Professional Killstreak Candy Cane Kit","id":"3314747"},{"name":"Professional Killstreak Market Gardener Kit","id":"2354022"},{"name":"Professional Killstreak Family Business Kit","id":"2462341"},{"name":"Professional Killstreak Solemn Vow Kit","id":"2392009"},{"name":"Specialized Killstreak Air Strike Kit","id":"14487459"},{"name":"Specialized Killstreak Stickybomb Launcher Kit","id":"2258936"},{"name":"Specialized Killstreak Holiday Punch Kit","id":"2414559"},{"name":"Specialized Killstreak Iron Bomber Kit","id":"27788908"},{"name":"Specialized Killstreak Grenade Launcher Kit","id":"2320968"},{"name":"Specialized Killstreak Big Earner Kit","id":"2318698"},{"name":"Specialized Killstreak Medi Gun Kit","id":"2261815"},{"name":"Specialized Killstreak Spy-cicle Kit","id":"2299575"},{"name":"Specialized Killstreak Chargin' Targe Kit","id":"2300580"},{"name":"Specialized Killstreak Black Rose Kit","id":"6714727"},{"name":"Specialized Killstreak Freedom Staff Kit","id":"2314328"},{"name":"Specialized Killstreak Crusader's Crossbow Kit","id":"2314522"},{"name":"Specialized Killstreak Tribalman's Shiv Kit","id":"2322411"},{"name":"Specialized Killstreak Fortified Compound Kit","id":"8274257"},{"name":"Specialized Killstreak Tide Turner Kit","id":"14484759"},{"name":"Specialized Killstreak Family Business Kit","id":"2373169"},{"name":"Specialized Killstreak Loose Cannon Kit","id":"2321435"},{"name":"Specialized Killstreak Apoco-Fists Kit","id":"2313450"},{"name":"Specialized Killstreak Flying Guillotine Kit","id":"2327919"},{"name":"Specialized Killstreak Persian Persuader Kit","id":"2354980"},{"name":"Specialized Killstreak Hitman's Heatmaker Kit","id":"2304874"},{"name":"Specialized Killstreak Fists of Steel Kit","id":"2301856"},{"name":"Specialized Killstreak Postal Pummeler Kit","id":"2319287"},{"name":"Specialized Killstreak Warrior's Spirit Kit","id":"2307261"},{"name":"Specialized Killstreak Quickiebomb Launcher Kit","id":"27687829"},{"name":"Specialized Killstreak Conscientious Objector Kit","id":"2320827"},{"name":"Specialized Killstreak Frontier Justice Kit","id":"2299131"},{"name":"Specialized Killstreak Conniver's Kunai Kit","id":"2389636"},{"name":"Specialized Killstreak Splendid Screen Kit","id":"2368722"},{"name":"Specialized Killstreak Back Scatter Kit","id":"14488821"},{"name":"Specialized Killstreak L'Etranger Kit","id":"2372203"},{"name":"Specialized Killstreak Fire Axe Kit","id":"2290660"},{"name":"Specialized Killstreak Ham Shank Kit","id":"2307302"},{"name":"Specialized Killstreak Pomson 6000 Kit","id":"2302910"},{"name":"Specialized Killstreak Back Scratcher Kit","id":"2374313"},{"name":"Specialized Killstreak Half-Zatoichi Kit","id":"2276057"},{"name":"Specialized Killstreak Market Gardener Kit","id":"2308905"},{"name":"Specialized Killstreak Panic Attack Kit","id":"27687833"},{"name":"Specialized Killstreak Sun-on-a-Stick Kit","id":"2361123"},{"name":"Specialized Killstreak Dragon's Fury Kit","id":"175977273"},{"name":"Specialized Killstreak Hot Hand Kit","id":"175977143"},{"name":"Specialized Killstreak Ullapool Caber Kit","id":"2308234"},{"name":"Specialized Killstreak Scottish Resistance Kit","id":"2319788"},{"name":"Specialized Killstreak Big Kill Kit","id":"6714515"},{"name":"Specialized Killstreak Quick-Fix Kit","id":"2326508"},{"name":"Specialized Killstreak Eureka Effect Kit","id":"2299615"},{"name":"Specialized Killstreak Brass Beast Kit","id":"2299420"},{"name":"Specialized Killstreak Frying Pan Kit","id":"6713962"},{"name":"Specialized Killstreak Rescue Ranger Kit","id":"2372320"},{"name":"Specialized Killstreak Sharp Dresser Kit","id":"2299578"},{"name":"Specialized Killstreak Pain Train Kit","id":"2378824"},{"name":"Specialized Killstreak Scorch Shot Kit","id":"2381569"},{"name":"Specialized Killstreak Bazaar Bargain Kit","id":"2358085"},{"name":"Specialized Killstreak Beggar's Bazooka Kit","id":"2306487"},{"name":"Specialized Killstreak Bread Bite Kit","id":"14498239"},{"name":"Specialized Killstreak Eviction Notice Kit","id":"2366409"},{"name":"Specialized Killstreak Liberty Launcher Kit","id":"2375083"},{"name":"Specialized Killstreak Vita-Saw Kit","id":"2368709"},{"name":"Specialized Killstreak Neon Annihilator Kit","id":"2435547"},{"name":"Specialized Killstreak Wrap Assassin Kit","id":"2365912"},{"name":"Specialized Killstreak Cleaner's Carbine Kit","id":"2361965"},{"name":"Specialized Killstreak Third Degree Kit","id":"2313705"},{"name":"Specialized Killstreak Direct Hit Kit","id":"2326333"},{"name":"Specialized Killstreak Escape Plan Kit","id":"2298109"},{"name":"Specialized Killstreak Boston Basher Kit","id":"2364796"},{"name":"Specialized Killstreak Reserve Shooter Kit","id":"2348837"},{"name":"Specialized Killstreak Necro Smasher Kit","id":"22773490"},{"name":"Professional Killstreak Sharpened Volcano Fragment Kit","id":"2723338"},{"name":"Professional Killstreak Huo-Long Heater Kit","id":"2385859"},{"name":"Professional Killstreak Fan O'War Kit","id":"2564763"},{"name":"Professional Killstreak Gloves of Running Urgently Kit","id":"2381687"},{"name":"Professional Killstreak Bat Outta Hell Kit","id":"2445046"},{"name":"Professional Killstreak Three-Rune Blade Kit","id":"2390594"},{"name":"Professional Killstreak Baby Face's Blaster Kit","id":"2390607"},{"name":"Professional Killstreak Loch-n-Load Kit","id":"2392444"},{"name":"Professional Killstreak Your Eternal Reward Kit","id":"2318727"},{"name":"Professional Killstreak Cow Mangler 5000 Kit","id":"2367358"},{"name":"Specialized Killstreak Huo-Long Heater Kit","id":"2361991"},{"name":"Specialized Killstreak Cow Mangler 5000 Kit","id":"2299486"},{"name":"Specialized Killstreak Gloves of Running Urgently Kit","id":"2390442"},{"name":"Specialized Killstreak Bat Outta Hell Kit","id":"2375882"},{"name":"Specialized Killstreak Three-Rune Blade Kit","id":"2291649"},{"name":"Professional Killstreak Pretty Boy's Pocket Pistol Kit","id":"2416631"},{"name":"Specialized Killstreak Pretty Boy's Pocket Pistol Kit","id":"2357261"},{"name":"Strange Professional Killstreak Sandstone Special Pistol (Field-Tested)","id":"63987391"},{"name":"Strange Professional Killstreak Sandstone Special Pistol (Factory New)","id":"67515097"},{"name":"Professional Killstreak C.A.P.P.E.R Kit","id":"75390992"},{"name":"Specialized Killstreak C.A.P.P.E.R Kit","id":"75215018"},{"name":"Specialized Killstreak Manmelter Kit","id":"2308215"},{"name":"Specialized Killstreak Rainblower Kit","id":"2365536"},{"name":"Specialized Killstreak Sandman Kit","id":"2313451"},{"name":"Specialized Killstreak Atomizer Kit","id":"2326758"},{"name":"Specialized Killstreak Classic Kit","id":"14493140"},{"name":"Specialized Killstreak Detonator Kit","id":"2298974"},{"name":"Specialized Killstreak Lollichop Kit","id":"2363777"},{"name":"Specialized Killstreak Force-A-Nature Kit","id":"2303223"},{"name":"Specialized Killstreak Sniper Rifle Kit","id":"2301167"},{"name":"Specialized Killstreak Rocket Launcher Kit","id":"2260203"},{"name":"Specialized Killstreak Syringe Gun Kit","id":"2259437"},{"name":"Specialized Killstreak Scottish Handshake Kit","id":"2388224"},{"name":"Specialized Killstreak Disciplinary Action Kit","id":"2378221"},{"name":"Specialized Killstreak Righteous Bison Kit","id":"2365529"},{"name":"Specialized Killstreak Baby Face's Blaster Kit","id":"2358626"},{"name":"Specialized Killstreak Your Eternal Reward Kit","id":"2369251"},{"name":"Specialized Killstreak SMG Kit","id":"2307378"},{"name":"Specialized Killstreak Revolver Kit","id":"2373511"},{"name":"Specialized Killstreak Ambassador Kit","id":"2347832"},{"name":"Specialized Killstreak Batsaber Kit","id":"75215017"},{"name":"Specialized Killstreak Minigun Kit","id":"2301173"},{"name":"Professional Killstreak Loose Cannon Kit","id":"2383042"},{"name":"Professional Killstreak Disciplinary Action Kit","id":"2408460"},{"name":"Professional Killstreak Sniper Rifle Kit","id":"2341896"},{"name":"Professional Killstreak Grenade Launcher Kit","id":"2316010"},{"name":"Professional Killstreak Iron Curtain Kit","id":"6721259"},{"name":"Professional Killstreak Ullapool Caber Kit","id":"2391337"},{"name":"Specialized Killstreak Flame Thrower Kit","id":"2262706"},{"name":"Specialized Killstreak Southern Hospitality Kit","id":"2394182"},{"name":"Specialized Killstreak Shooting Star Kit","id":"75222760"},{"name":"Specialized Killstreak Wanga Prick Kit","id":"2375926"},{"name":"Specialized Killstreak Black Box Kit","id":"2311530"},{"name":"Specialized Killstreak Scotsman's Skullcutter Kit","id":"2327490"},{"name":"Specialized Killstreak Holy Mackerel Kit","id":"2323392"},{"name":"Specialized Killstreak Flare Gun Kit","id":"2314892"},{"name":"Specialized Killstreak AWPer Hand Kit","id":"6713734"},{"name":"Specialized Killstreak Short Circuit Kit","id":"2343073"},{"name":"Specialized Killstreak Sydney Sleeper Kit","id":"2316479"},{"name":"Specialized Killstreak Claidheamh Mòr Kit","id":false},{"name":"Specialized Killstreak Soda Popper Kit","id":"2318764"},{"name":"Specialized Killstreak Solemn Vow Kit","id":"2418271"},{"name":"Specialized Killstreak Candy Cane Kit","id":"2369166"},{"name":"Specialized Killstreak Iron Curtain Kit","id":"6717471"},{"name":"Specialized Killstreak Fan O'War Kit","id":"2380675"},{"name":"Specialized Killstreak Sharpened Volcano Fragment Kit","id":"2310846"},{"name":"Specialized Killstreak Killing Gloves of Boxing Kit","id":"2367841"},{"name":"Specialized Killstreak Nessie's Nine Iron Kit","id":"2393717"},{"name":"Specialized Killstreak Loch-n-Load Kit","id":"2313216"}];


class TF2Kit {

   constructor(INVENTORY_CACHE_TIME, MARKET_CACHE_TIME, REQUEST_DELAY, STEAM_ID, ITEM_IDS, DEFAULT_SORT_DIRECTION) {
       this.INVENTORY_CACHE_TIME = INVENTORY_CACHE_TIME;
       this.MARKET_CACHE_TIME  = MARKET_CACHE_TIME;
       this.REQUEST_DELAY = REQUEST_DELAY;
       this.STEAM_ID = STEAM_ID;
       this.ITEM_IDS = ITEM_IDS;
       this.DEFAULT_SORT_DIRECTION =  DEFAULT_SORT_DIRECTION;
       this.COLLECTION = [];
       this.TIMERS = [];
       this.FAILED_FETCHES = [];
       this.TIMER_DELAY = 0;
   }
    init() {
        this.insertHTML();
        this.insertCSS();

        this.fetchUserInventory().then( (inventory_data) => {
             this.showElement('#zenger-fab-results');
              inventory_data.descriptions.forEach( item => {
                  if ( (item.name.startsWith("Specialized Killstreak ") || item.name.startsWith("Professional Killstreak ")) && item.name.endsWith("Fabricator")) {
                     let kit_name = item.name.replace(" Fabricator", ""); // presume
                     let kit_with_id = this.itemInList( kit_name );
                     if (kit_with_id !== undefined) {

                          if (! this.fromCache( this.toSlug( kit_name ), this.MARKET_CACHE_TIME ) ) {
                              this.fetchItemPriceTimer( kit_with_id ).then(  (kitinfo) => {
                                     this.renderResults( kitinfo );
                              }).catch( ex => {
                                  console.log(ex);
                              });
                          } else {
                              // draw
                              this.renderResults(  this.fromCache( this.toSlug( kit_name , this.MARKET_CACHE_TIME ) ) );
                          }
                      }
                  }
              });

        }).catch( ex => {
           this.hideElement('#zenger-fab-results');
            this.displayAlertMessage("STEAM isn't returning inventory data. Please wait a little bit and retry again");
        });
        this.bindCancelButton();
    }
    bindCancelButton() {
        let _this = this;
         document.querySelector('#z-cancel-transactions').addEventListener("click", (e) => {
            e.preventDefault();
            if ( _this.fromStore( 'promise_timers').length > 0) {
                _this.fromStore( 'promise_timers').forEach( timer => {
                    clearTimeout( timer );
                });
            }
         });

    }
    getRequest( url ) {
        console.log(`[HTTP] ${url}`);
         this.displayAlertMessage('Working ...');
        let _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                    _this.displayAlertMessage(false, true);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                     _this.displayAlertMessage(false, true);
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
                 _this.displayAlertMessage(false, true);
            };
            xhr.send();
        });
    }

    fetchUserInventory() {
       return new Promise((resolve, reject) => {
              if ( !this.fromCache('user_inventory', this.INVENTORY_CACHE_TIME) ) {
                  this.getRequest(`https://steamcommunity.com/inventory/${this.STEAM_ID}/440/2?l=english&count=5000`)
                      .then( response => {
                      response = JSON.parse(response);
                      this.toCache('user_inventory', response);
                      resolve( response );
                  }).catch( e => {
                      reject(e);
                  });
              } else {
                  resolve( this.fromCache('user_inventory', this.INVENTORY_CACHE_TIME) );
              }
          });
    }

    fetchItemPriceTimer( kit, done ) {
        let _this = this;
       return new Promise( (resolve, reject) => {
           var timer =  setTimeout( () => {
               this.getRequest(`https://steamcommunity.com/market/itemordershistogram?country=US&language=english&currency=1&item_nameid=${kit.id}&two_factor=0`)
                   .then( response => {
                   let fabinfo = JSON.parse(response);
                   let price = fabinfo.buy_order_graph[0][0] || false;
                   let context = { name: kit.name, id: kit.id, price: price };
                   this.toCache( this.toSlug( kit.name ), context);
                   this.COLLECTION.push( context );
                   // this.toCache ( 'market_value' , context );
                   resolve( context );
                   _this.TIMERS.splice( this.TIMERS.indexOf( timer ) );
               }).catch( i => {

                   this.FAILED_FETCHES.push( kit.id );
                   reject( kit.id );
               });
           } , this.TIMER_DELAY );


           _this.TIMERS.push( timer );

           var timer_list = this.fromStore('promise_timers');
           timer_list.push( timer );
           this.toStore( 'promise_timers', timer_list );

           this.TIMER_DELAY += this.REQUEST_DELAY;
       });
    }

    insertHTML() {
        if (document.querySelector('#zenger-fab-results')) return;
        var html = `<div id="zenger-fab-results"><table class="z-results"><thead><tr><th><a href="#" class="z-sort-name">Item</a><span class="z-sort-name-dir"></span></th><th><a href="#" class="z-sort-price">Price</a><span class="z-sort-price-dir"></span></th></tr></thead><tbody></tbody></table><div class='z-footnote'><span style='float:left;padding-left:16px;'><small><a target="_blank" href="https://steamcommunity.com/tradeoffer/new/?partner=90642500&token=74Xde02S"><small>Donate</small></a> | <a target="_blank" href="https://github.com/Zenger/tf2-kit-prices">Code</a></small> </span><a href="#" style="float:right;margin-right:13px;" class='btn_small btn_grey_white_innerfade' id='z-cancel-transactions'><span>STOP</span></a></div></div>`;
        var htmlTag  = document.createElement('div'); htmlTag.innerHTML = html; document.querySelector('#active_inventory_page').appendChild( htmlTag );
        this.bindSortButtons();
    }
    insertCSS() {
         var css  = `.z-hidden{display:none;transition:all 1s ease}.z-show{display:block;transition:all 1s ease}.z-results{width:97%;border:1px solid #3d3d3d;padding:15px;margin:15px}.z-results th{padding-bottom:15px;border-bottom:1px solid #3d3d3d}.z-results a.z-sort-name,.z-results a.z-sort-price{float:left}.z-results .z-sort-name-dir,.z-results .z-sort-price-dir{float:right}.z-results tbody td{padding:5px 0;border-bottom:1px dotted #3d3d3d}.z-footnote{padding-bottom:15px;}`;
         var styleTag = document.createElement('style'); styleTag.id = "z-results-styles"; styleTag.appendChild(document.createTextNode( css )); document.querySelector("head").appendChild( styleTag );
    }

    bindSortButtons() {
        let sort_name_element = document.querySelector('#zenger-fab-results .z-sort-name');
        let sort_name_direction = document.querySelector('#zenger-fab-results .z-sort-name-dir');
        let sort_price_element = document.querySelector('#zenger-fab-results .z-sort-price');
        let sort_price_direction = document.querySelector('#zenger-fab-results .z-sort-price-dir');

        sort_name_element.addEventListener( "click", e => {
           e.preventDefault();

           if (this.DEFAULT_SORT_DIRECTION == 0) {
              sort_name_direction.innerHTML = "&uarr;";
              sort_price_direction.innerHTML = "";
              this.DEFAULT_SORT_DIRECTION = 1;
              this.triggerReRender();
           }
           else {
              sort_name_direction.innerHTML = "&darr;";
              sort_price_direction.innerHTML = "";
              this.DEFAULT_SORT_DIRECTION = 0;
              this.triggerReRender();
           }
        });


        sort_price_element.addEventListener( "click", e => {
           e.preventDefault();

           if (this.DEFAULT_SORT_DIRECTION == 2) {
              sort_price_direction.innerHTML = "&uarr;";
                sort_name_direction.innerHTML = "";
              this.DEFAULT_SORT_DIRECTION = 3;
              this.triggerReRender();
           }
           else {
              sort_price_direction.innerHTML = "&darr;";
                sort_name_direction.innerHTML = "";
              this.DEFAULT_SORT_DIRECTION = 2;
              this.triggerReRender();
           }
        });


    }
    toSlug(text)
    {
        return text
            .toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'')
        ;
    }
    toStore( key, data) {
        return GM_setValue( key, JSON.stringify( data ) );
    }
    fromStore( key )
    {
        var data = ( GM_getValue( key ) ) ? JSON.parse( GM_getValue(key) ) : [];
        return data;
    }
    clearCache( key ) {
        GM_deleteValue( key );
    }

    toCache( key, data ) {
        return GM_setValue( key, JSON.stringify( { data: data, write_timestamp: +new Date() }) );
    }

    fromCache( key , expiration ) {
        var data = ( GM_getValue( key ) ) ? JSON.parse( GM_getValue(key) ) : false;
        if ( data ) {
            if ( data.write_timestamp + expiration > +new Date() ) {
                return data.data;
            } else {
                GM_deleteValue( key );
                return false;
            }
        } else {
            return false
        }
    }
    itemInList( inventory_item ) {
        return this.ITEM_IDS.filter( item => item.name == inventory_item )[0];
    }
    showElement( sel ) {
        let elem = document.querySelector(sel);
        if (elem) { elem.removeClassName('z-hidden'); }
    }
    hideElement( sel ) {
      document.querySelector(sel).addClassName('z-hidden');
    }

    displayAlertMessage( alert , destroy ) {
        let clear = destroy || false;
        var msg;
        if (document.querySelectorAll("#error_display").length <= 0) { msg = document.createElement("div");  } else { msg = document.querySelector("#error_display"); }
        msg.innerHTML = alert ;
        msg.id = "error_display"; msg.className = "profile_fatalerror_message";
        msg.style.marginTop = "20px";
        if ( destroy ) { msg.style.visibility = "hidden"; } else { msg.style.visibility = "visible"; }
        document.querySelector("#zenger-fab-results").appendChild( msg );
    }

    sortByNameOrPrice( object, direction ) {
        if ( direction == 0) {
            return object.sort(function(a, b) {
                var textA = a.name;
                var textB = b.name;;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        } else if ( direction == 1) {
            return object.sort(function(a, b) {
                var textA = a.name;
                var textB = b.name;;
                return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
        } else if ( direction == 2 ) {
            return object.sort(function(a, b) {
                var textA = a.price;
                var textB = b.price;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
        else {

            return object.sort(function(a, b) {
                var textA = a.price;
                var textB = b.price;
                return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
        }

    }
    triggerReRender() {
      this.renderResults();
    }
    clearResultsArea() {
       this.COLLECTION.forEach( item => {
            if( document.querySelector('#zenger-fab-results tr#'+ this.toSlug( item.name ))) {
                document.querySelector('#zenger-fab-results tr#'+ this.toSlug( item.name )).remove();
            }
       });
    }
    renderResults( context ) {

        let sorted_results = this.sortByNameOrPrice(this.COLLECTION, this.DEFAULT_SORT_DIRECTION );
        this.clearResultsArea();

        sorted_results.forEach( item => {
           this.appendResultLine(item);
        });
    }

    appendResultLine( data ) {
       if ( document.querySelector( "#" + this.toSlug( data.name ) ) ) return;
       var elem = document.createElement("tr");
       elem.innerHTML = `<td><a href="https://steamcommunity.com/market/listings/440/${data.name}" target="_blank">${data.name}</a></td><td>${data.price}</td>`;
       elem.id = this.toSlug( data.name );
       document.querySelector("#zenger-fab-results table tbody").appendChild( elem );
    }

}

(function() {
    'use strict';

      var btn = document.createElement("button"); btn.innerHTML = "<span>Earnings</span>"; btn.id = "z-fetch-prices"; btn.className = "item_market_action_button btn_green_white_innerfade btn_small"; document.querySelector(".filter_tag_button_ctn").appendChild( btn);
      btn.addEventListener("click", (e) => {

         let tf2kit = new TF2Kit(INVENTORY_CACHE_TIME, MARKET_CACHE_TIME, REQUEST_DELAY, STEAM_ID, ITEM_IDS, DEFAULT_SORT_DIRECTION);
         tf2kit.init();
         location.hash = "#zenger-fab-results";
      });

})();
