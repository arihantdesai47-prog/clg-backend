import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Karnataka District + Taluk seeding...");

  // 1️⃣ State
  const karnataka = await prisma.state.upsert({
    where: { name: "Karnataka" },
    update: {},
    create: { name: "Karnataka" }
  });

  // 2️⃣ District + Taluk Mapping
  const districtTalukMap: Record<string, string[]> = {
    Belagavi: ["Athani","Bailhongal","Belagavi","Chikodi","Gokak","Hukkeri","Khanapur","Kagawad","Mudhol","Nippani","Kittur","Raybag","Ramdurg","Saundatti"],
    Bagalkot: ["Badami","Bagalkot","Bilagi","Rabkavi-Banahatti","Hungund","Ilkal","Jamkhandi","Mudhol"],
    Dharwad: ["Annigeri","Dharwad","Hubballi","Hubballi City","Kalghatgi","Kundgol","Navalgund"],
    Gadag: ["Gadag","Gajendragad","Lakshmeshwar","Mundargi","Nargund","Ron","Shirhatti"],
    Haveri: ["Byadgi","Hangal","Haveri","Hirekerur","Ranebennur","Savanur","Shiggaon","Rattihalli"],
    "Uttara Kannada": ["Ankola","Bhatkal","Haliyal","Honnavar","Karwar","Kumta","Mundgod","Siddapur","Sirsi","Yellapur"],
    Vijayapura: ["Basavana Bagewadi","Indi","Muddebihal","Sindagi","Vijayapura","Babaleshwar","Talikota","Devara Hippargi","Kolhar","Chadchan","Tikota"],

    "Bengaluru Urban": ["Anekal","Bangalore East","Bangalore North","Bangalore South","Yelahanka"],
    "Bengaluru Rural": ["Devanahalli","Doddaballapura","Hoskote","Nelamangala"],
    Chikkaballapur: ["Bagepalli","Chikkaballapura","Chintamani","Gauribidanur","Gudibanda","Sidlaghatta"],
    Chitradurga: ["Challakere","Chitradurga","Hiriyur","Hosadurga","Holalkere","Molakalmuru"],
    Kolar: ["Bangarpet","Kolar","Malur","Mulbagal","Srinivaspur"],
    Ramanagara: ["Channapatna","Kanakapura","Magadi","Ramanagara"],
    Tumakuru: ["Chikkanayakanahalli","Gubbi","Koratagere","Kunigal","Madhugiri","Pavagada","Sira","Tiptur","Tumakuru","Turuvekere"],
    Shivamogga: ["Bhadravati","Hosanagara","Sagara","Shikaripura","Shivamogga","Soraba","Thirthahalli"],
    Davanagere: ["Channagiri","Davanagere","Harihar","Honnali","Jagalur","Nyamathi"],

    Mysuru: ["Hunsur","K R Nagar","Mysuru","Nanjangud","Piriyapatna","Heggadadevana Kote","T Narasipura","Saraguru"],
    Chamarajanagar: ["Chamarajanagar","Gundlupet","Kollegal","Yelandur","Hanur"],
    Chikkamagaluru: ["Chikkamagaluru","Koppa","Mudigere","Narasimharajapura","Sringeri","Tarikere","Kadur"],
    "Dakshina Kannada": ["Bantwal","Mangaluru","Moodabidri","Puttur","Sullia","Kadaba","Belthangady"],
    Hassan: ["Alur","Arkalgud","Arsikere","Belur","Channarayapatna","Hassan","Holenarasipura","Sakleshpur"],
    Kodagu: ["Madikeri","Somwarpet","Virajpet","Ponnampet","Kushalnagar"],
    Mandya: ["Krishnarajpet","Maddur","Malavalli","Mandya","Nagamangala","Pandavapura","Srirangapatna"],
    Udupi: ["Udupi","Karkala","Kundapura","Brahmavara","Byndoor","Hebri","Kaup"],

    Ballari: ["Ballari","Kurugodu","Siraguppa","Kampli","Sandur"],
    Bidar: ["Aurad","Basavakalyan","Bhalki","Bidar","Bidar South","Humnabad","Kamalnagar","Chitguppa"],
    Kalaburagi: ["Afzalpur","Aland","Chincholi","Chittapur","Kalaburagi","Kalaburagi South","Jewargi","Sedam","Shahabad","Yedrami","Kamalapur"],
    Koppal: ["Gangavathi","Koppal","Kushtagi","Yelburga","Kanakagiri","Karatagi","Kuknoor"],
    Raichur: ["Devadurga","Manvi","Raichur","Sindhanur","Sirwar","Maski","Lingsugur"],
    Yadgir: ["Gurmitkal","Shahpur","Shorapur","Vadagera","Yadgir","Hunasagi"],
    Vijayanagara: ["Harapanahalli","Hoovina Hadagali","Hagaribommanahalli","Hospet","Kudligi","Kotturu"]
  };

  // 3️⃣ Insert Districts
  for (const districtName of Object.keys(districtTalukMap)) {
    const district = await prisma.district.upsert({
      where: { name: districtName },
      update: {},
      create: {
        name: districtName,
        stateId: karnataka.id
      }
    });

    // 4️⃣ Insert Taluks
    const taluks = districtTalukMap[districtName];

    await prisma.taluk.createMany({
      data: taluks.map((taluk) => ({
        name: taluk,
        districtId: district.id
      })),
      skipDuplicates: true
    });
  }

  console.log("✅ Districts + Taluks seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });