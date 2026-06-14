import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useSEO } from '../../hooks/useSEO';

interface Settings {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  logoUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

interface DistrictSEOData {
  slug: string;
  districtName: string;
  title: string;
  metaDesc: string;
  h1: string;
  h2: string;
  paragraphs: string[];
}

const districtDataMap: Record<string, DistrictSEOData> = {
  derekoy: {
    slug: 'derekoy',
    districtName: 'Dereköy',
    title: 'Samsun Dereköy Fırın Sütlaç - Taş Fırında Hakiki Sütlaç | Koç Restaurant',
    metaDesc: 'Samsun Dereköy\'de hakiki fırın sütlaç nerede yenir? Dereköy limanı ve balık restoranları sonrası, taş fırında pişen meşhur fırın sütlacımızı denemek için Koç Restaurant\'a davetlisiniz.',
    h1: 'Dereköy Fırın Sütlaç Lezzet Durağı: Taş Fırından Sofranıza',
    h2: 'Dereköy Balık Keyfi Sonrası Hafif ve Geleneksel Bir Tatlı Arayanlar İçin',
    paragraphs: [
      'Samsun Dereköy mevkii, eşsiz limanı, taze balıkçı restoranları ve sakin sahil havasıyla bilinir. Güzel bir Dereköy akşamında, deniz havasını içinize çektikten sonra bu keyifli yemeği taçlandıracak en güzel lezzet hafif ve geleneksel bir süt tatlısıdır. Koç Restaurant olarak, yılların mutfak tecrübesiyle hazırladığımız meşhur fırın sütlacımızı Dereköy sakinlerinin beğenisine sunuyoruz.',
      'Sütlacımızın sırrı, doğallığı ve pişirilme tekniğinde gizlidir. Samsun\'un yemyeşil meralarında otlayan ineklerden elde edilen günlük taze sütü, taze yumurta sarısı ve pancar şekeri ile birleştirerek geleneksel reçetemize sadık kalıyoruz. Hazırlanan karışımı toprak güveçlere doldurarak taş fırınımızda, odun ateşinin verdiği o hafif is aromasıyla üstü altın sarısı ve karamelize olana kadar pişiriyoruz.',
      'Katkı maddelerinden uzak, tamamen organik ve doğal malzemelerle pişirilen taş fırın sütlacımız, Dereköy\'de tatlı kaçamağı yapmak isteyenlerin bir numaralı adresi haline gelmiştir. Siz de Dereköy sahil turunuzun veya enfes akşam yemeğinizin ardından, damağınızda unutulmaz bir iz bırakacak hafif ve doğal bir lezzet arıyorsanız, Koç Restaurant\'ın taş fırından yeni çıkmış, üzeri kavrulmuş fındık taneleriyle süslenmiş fırın sütlacını mutlaka denemelisiniz.'
    ]
  },
  taflan: {
    slug: 'taflan',
    districtName: 'Taflan',
    title: 'Samsun Taflan Fırın Sütlaç - Doğal Süt ve Taş Fırın Lezzeti | Koç Restaurant',
    metaDesc: 'Taflan yazlıkçıları ve sakinleri için Samsun\'un en meşhur fırın sütlacı Koç Restaurant\'ta. Doğal köy sütü ve karamelize dokusuyla eşsiz taş fırın sütlacı deneyimi.',
    h1: 'Taflan Fırın Sütlaç: Yazlıkların ve Sahilin En Tatlı Kaçamağı',
    h2: 'Doğal Köy Sütü ve Taş Fırın Ateşinin Buluşması',
    paragraphs: [
      'Taflan, Samsun\'un özellikle yaz aylarında cıvıl cıvıl olan, plajları ve deniz havasıyla dinlendirici yazlık bölgelerinden biridir. Sıcak yaz günlerinde sahil yürüyüşünün ardından veya aileyle geçirilen güzel bir pazar gününün sonrasında insanın canı hafif ama bir o kadar da lezzetli bir tatlı çeker. İşte tam bu anlarda, Koç Restaurant\'ın Samsun Taflan mevkisinde dillerden düşmeyen meşhur fırın sütlacı devreye giriyor.',
      'Geleneksel Türk mutfağının en asil sütlü tatlısı olan fırın sütlaç, ustalarımızın ellerinde adeta bir başyapıta dönüşüyor. Nişasta ve yapay kıvam arttırıcılar kullanmak yerine, pirincin kendi doğal özünü ve taze köy sütünü yavaş yavaş kaynatarak doğru kıvamı yakalıyoruz. Fırınlama esnasında güveçlerin üst kısmında oluşan o hafif yanık ve karamelize tabaka, tatlıya benzersiz bir aroma kazandırıyor.',
      'Taflan\'da tatlı denince akla ilk gelen hafiflik ve doğallık ilkesini benimseyerek, sütlacımızda en kaliteli malzemeleri kullanıyoruz. Üzerine serptiğimiz taze kavrulmuş Karadeniz fındığı ile çıtırlık kattığımız bu eşsiz lezzet, tatlı krizlerinizi en sağlıklı şekilde bastıracaktır. Taflan sahilinin serinliğini yaşarken, canınız geleneksel bir taş fırın sütlacı çektiğinde sizi ve sevdiklerinizi ağırlamaktan mutluluk duyacağız.'
    ]
  },
  ondokuzmayis: {
    slug: 'ondokuzmayis',
    districtName: 'Ondokuzmayıs',
    title: 'Ondokuzmayıs (19 Mayıs) Fırın Sütlaç - Yöresel Taş Fırın Süt Tatlısı | Koç Restaurant',
    metaDesc: 'Samsun 19 Mayıs (Ondokuzmayıs) ilçesinde meşhur taş fırın sütlacı nerede yenir? Katkısız, doğal köy sütünden yapılan fırın sütlacımızla hizmetinizdeyiz.',
    h1: 'Ondokuzmayıs (19 Mayıs) İlçesinin En Sevilen Fırın Sütlacı',
    h2: 'Geleneksel Karadeniz Lezzeti: Doğal ve Koruyucusuz',
    paragraphs: [
      'Samsun\'un doğası ve tarihi ile öne çıkan ilçesi Ondokuzmayıs (19 Mayıs), zengin tarım arazileri ve hayvancılığı sayesinde doğal süt ürünlerine erişim açısından oldukça şanslı bir bölgedir. Biz de Koç Restaurant olarak, bu bölgenin sunduğu en taze ve kaliteli günlük sütleri toplayarak mutfağımızda bir lezzet şölenine dönüştürüyoruz. Ondokuzmayıs halkı ve misafirleri için hazırladığımız fırın sütlacımız, yörenin en çok tercih edilen tatlısı konumundadır.',
      'Süt tatlılarında en önemli unsur malzemenin saflığıdır. Sütlacımızda kullandığımız sütü hiçbir endüstriyel işlemden geçirmeden, taze ve tam yağlı haliyle işliyoruz. Taş fırının yüksek ısısında güveçlerde ağır ağır pişen sütlaçlarımız, fırından çıktığında o mükemmel koyu kıvamını ve fırınlanmış kokusunu kazanır. Tatlımızı yaparken pancar şekeri dışında hiçbir yapay tatlandırıcı veya koruyucu madde eklemiyoruz.',
      'Ondokuzmayıs ilçesinde aileniz ve arkadaşlarınızla geçireceğiniz güzel bir yemeğin ardından ya da gün içinde kendinizi ödüllendirmek istediğinizde fırın sütlacımız en hafif seçenek olacaktır. Yanında demli bir Karadeniz çayı veya Türk kahvesiyle servis edilen, üzeri fındık kaplı nefis güveç sütlacımızı denemek üzere sizleri Koç Restaurant kalitesiyle tanışmaya davet ediyoruz.'
    ]
  },
  engiz: {
    slug: 'engiz',
    districtName: 'Engiz',
    title: 'Engiz Fırın Sütlaç - Taş Fırında Karamelize Güveç Sütlaç | Koç Restaurant',
    metaDesc: 'Samsun Engiz mevkii sakinleri için özel taş fırın sütlacı tarifi. Doğal köy sütü ve odun ateşinin kattığı o enfes yanık lezzet için hemen tıklayın.',
    h1: 'Engiz Fırın Sütlaç Durağı: Taş Fırın Odun Ateşinde Pişen Lezzet',
    h2: 'Engiz Sakinleri İçin Hakiki Malzemelerle Hazırlanan Geleneksel Süt Tatlısı',
    paragraphs: [
      'Engiz, köklü geçmişi ve sıcak insanlarıyla Samsun\'un samimi yaşam merkezlerinden biridir. Engiz\'de güzel bir günün ardından dostlarla bir araya gelip keyifli bir sohbet eşliğinde tatlı yemek, Karadeniz kültürünün vazgeçilmez bir parçasıdır. Koç Restaurant olarak, bu kültürü en iyi şekilde temsil eden, odun ateşinde pişmiş geleneksel taş fırın sütlacımızla Engiz halkına unutulmaz bir lezzet sunuyoruz.',
      'Ustalarımızın özel tarifiyle hazırlanan fırın sütlacımız, fırınlama aşamasında taş fırının o kendine has odun dumanı ile temas ederek hafif isli ve asil bir karamelize nota kazanır. Güveçlerimizin fırından çıktığı andaki cızırtısı ve kokusu, henüz ilk bakışta iştahınızı açacaktır. Kullandığımız pirincin nişastası sütle mükemmel bir şekilde bütünleşerek ağızda pürüzsüz bir doku bırakır.',
      'Sağlıklı ve hafif beslenmeye özen gösterenler için de ideal bir tatlı olan fırın sütlacımız, tatlı ihtiyacınızı ağır şerbetler yerine süt hafifliğiyle karşılar. Engiz\'de canınız ne zaman gerçek, katkısız bir fırın sütlacı çekse, özenle kavrulmuş fındıklarla süslenmiş sıcacık güveçlerimizi tatmak için restaurantımıza bekleriz.'
    ]
  },
  yorukler: {
    slug: 'yorukler',
    districtName: 'Yörükler',
    title: 'Samsun Yörükler Köyü Fırın Sütlaç - Deltanın Doğal Sütlü Tatlısı | Koç Restaurant',
    metaDesc: 'Kızılırmak Deltası Yörükler köyü turu sonrası en iyi fırın sütlaç Koç Restaurant\'ta. Organik köy sütünden geleneksel taş fırın güveç sütlacı keyfi.',
    h1: 'Yörükler Köyü Fırın Sütlaç: Doğa ile Lezzetin Buluşma Noktası',
    h2: 'Kızılırmak Deltası Gezinizden Sonra Unutulmaz Bir Tatlı Molası',
    paragraphs: [
      'Kızılırmak Deltası Kuş Cenneti\'nin sınırlarında yer alan Yörükler bölgesi, muhteşem doğası, yaban hayatı ve otantik Karadeniz köy kültürüyle Samsun\'un en önemli turistik noktalarından biridir. Deltayı gezen, doğa fotoğrafçılığı yapan veya göl kenarında vakit geçiren misafirlerin bu doğa harikası geziyi Samsun\'un en ünlü süt tatlısı ile taçlandırması gelenek haline gelmiştir. Koç Restaurant, Yörükler köyü yakınlarında en doğal fırın sütlacı sunan lezzet durağınızdır.',
      'Sütlacımızın ana maddesi olan sütü, bu coğrafyanın tertemiz meralarında serbestçe beslenen ineklerden elde edilen doğal köy sütünden seçiyoruz. Bu taze süt, sütlacımıza endüstriyel sütlerin asla veremeyeceği o yoğun lezzet derinliğini ve kremamsı yapıyı kazandırıyor. Geleneksel toprak güveçlerde, odun ateşinde üzeri hafifçe yakılarak pişirilen sütlacımız tam bir Karadeniz klasiğidir.',
      'Yörükler ve delta turunuzun ardından yorgunluk atmak, doğanın huzurunu damağınızdaki enfes tatla birleştirmek isterseniz fırın sütlacımız tam size göredir. Üzerine bolca dökülen taze çekilmiş Karadeniz fındığı ile servis ettiğimiz taş fırın sütlacımızı denemek için Koç Restaurant\'a uğramayı ihmal etmeyin.'
    ]
  },
  incesu: {
    slug: 'incesu',
    districtName: 'İncesu',
    title: 'Samsun İncesu Fırın Sütlaç - Plaj Sonrası Taş Fırın Sütlaç Keyfi | Koç Restaurant',
    metaDesc: 'Atakum İncesu plajı mevkisinde Samsun\'un en iyi fırın sütlacını keşfedin. Doğal malzemelerle hazırlanan taş fırında güveç sütlacı Koç Restaurant\'ta.',
    h1: 'İncesu Fırın Sütlaç: Deniz Havası ve Sütlü Tatlının Uyumu',
    h2: 'Samsun İncesu Sahilinde Ferahlatıcı ve Geleneksel Bir Lezzet Rüzgarı',
    paragraphs: [
      'Samsun\'un İncesu bölgesi, temiz plajları, sahil yürüyüş yolları ve deniz turizmi ile Atakum\'un gözde mevkilerinden biridir. Özellikle yaz aylarında deniz keyfinin ardından serinlemek ve tatlı ihtiyacını karşılamak için hafif süt tatlıları tercih edilir. Ağır şerbetli tatlıların aksine, İncesu sahilinde yenecek buz gibi soğuk bir fırın sütlaç hem ferahlatıcı hem de son derece doyurucudur. Koç Restaurant olarak İncesu bölgesine bu lezzeti taşımaktan gurur duyuyoruz.',
      'Taş fırın sütlacımız, geleneksel pişirme yöntemlerine sadık kalınarak hazırlanır. Taze köy sütünü pancar şekeri ve pirinç ile ağır ateşte pişirdikten sonra güveçlere doldurup taş fırınımızda üstü karamelize olana dek bekletiyoruz. Bu süreçte sütlaç, fırının odun ateşinden gelen o eşsiz aromayı içine çeker ve fırından çıktığında soğutularak dinlendirilir.',
      'İncesu\'da denizden çıktıktan sonra veya güzel bir akşam yürüyüşü esnasında canınız hafif, katkısız ve lezzetli bir tatlı çekiyorsa, üzeri bol kavrulmuş fındıklı fırın sütlacımız tam size göre. Koç Restaurant\'ın nezih ortamında bu enfes Karadeniz klasiğini tatmak için sizleri ağırlamaktan mutluluk duyarız.'
    ]
  },
  atakum: {
    slug: 'atakum',
    districtName: 'Atakum',
    title: 'Samsun Atakum Fırın Sütlaç - Atakum Sahilinde Taş Fırın Sütlaç | Koç Restaurant',
    metaDesc: 'Samsun Atakum\'da en iyi fırın sütlaç nerede yenir? Atakum sahiline yakın, günlük taze süt ve taş fırında pişen hakiki güveç sütlacı Koç Restaurant\'ta.',
    h1: 'Atakum Fırın Sütlaç Durağı: Atakum Sahilinin En Meşhur Lezzeti',
    h2: 'Atakum\'da Geleneksel Karadeniz Esintisi: Taş Fırında Güveç Sütlaç',
    paragraphs: [
      'Atakum, Samsun\'un modern yüzünü temsil eden, kafeleri, restoranları ve kilometrelerce uzanan sahil şeridiyle şehrin en dinamik ilçesidir. Gastronomi dünyasının en seçkin örneklerinin yer aldığı Atakum\'da, misafirlerimiz her zaman en kaliteli ve orijinal lezzetleri arar. Koç Restaurant olarak, Atakum\'da tatlı tutkunlarına hakiki Karadeniz usulü taş fırın sütlacı sunuyoruz.',
      'Sütlacımızın yapımında hiçbir hazır kıvam arttırıcı, nişasta veya suni aroma kullanılmaz. Samsun\'un yerel çiftliklerinden günlük olarak temin ettiğimiz tam yağlı taze sütü, taze yumurtalarla ve doğal pancar şekeriyle çırparak güveçlere dolduruyoruz. Taş fırınımızdaki odun ateşinde pişerken üzeri nar gibi kızaran sütlacımız, ideal kıvamı ve damakta eriyen yapısıyla fark yaratır.',
      'Atakum sahili boyunca yapacağınız yürüyüşlerin veya akşam yemeklerinizin ardından canınız hafif, taze ve şık bir tatlı çektiğinde fırın sütlacımız en doğru tercih olacaktır. Üzerine serptiğimiz taze kavrulmuş fındık taneleriyle servis ettiğimiz bu geleneksel lezzeti Atakum\'un o güzel esintisi eşliğinde denemek için Koç Restaurant\'a davetlisiniz.'
    ]
  },
  bafra: {
    slug: 'bafra',
    districtName: 'Bafra',
    title: 'Samsun Bafra Fırın Sütlaç - Bafra Yöresel Sütlü Tatlısı | Koç Restaurant',
    metaDesc: 'Bafra pide keyfi sonrası Samsun\'un en iyi fırın sütlacı Koç Restaurant\'ta. Bafra mevkii için özel üretilen doğal taş fırın güveç sütlacımızı keşfedin.',
    h1: 'Bafra Fırın Sütlaç: Pide Keyfinin En İyi Tamamlayıcısı',
    h2: 'Bafra Yöresel Lezzetleri Arasında Hafif ve Leziz Bir Soluk',
    paragraphs: [
      'Bafra, kendine has pidesi, nokulu ve zengin mutfak kültürüyle Karadeniz\'in gastronomi başkentlerinden biridir. Bafra\'da yenilen meşhur kapalı pidenin ardından, yemeği hafifletmek ve damakları tatlandırmak için en çok tercih edilen tatlı fırın sütlaçtır. Koç Restaurant olarak, Bafra mutfağının bu tatlı ihtiyacını en üst düzey kaliteyle ve geleneksel yöntemlerle karşılıyoruz.',
      'Bizim fırın sütlacımız, Bafra ovalarının bereketli topraklarında otlayan hayvanların sütüyle hazırlanır. Bu sütün yoğunluğu ve lezzeti tatlımıza asıl karakterini verir. Taş fırında odun ısısıyla yavaşça karamelize olan üst tabaka, güveç içerisindeki pürüzsüz ve kadifemsi kıvamla birleştiğinde mükemmel bir uyum yakalar. Sütlacımızda glikoz şurubu veya hiçbir koruyucu madde yer almaz.',
      'Bafra yöresinde zengin bir akşam yemeğini en asil şekilde bitirmek veya gün ortasında keyifli bir çay saati geçirmek isteyenler için taş fırın sütlacımız vazgeçilmez bir seçenektir. Üzeri taze çekilmiş Karadeniz fındığı ile bezenmiş nefis güveç sütlacımızı denemek için sizleri Bafra mevkisinde Koç Restaurant\'a bekliyoruz.'
    ]
  },
  ballica: {
    slug: 'ballica',
    districtName: 'Ballıca',
    title: 'Samsun Ballıca Fırın Sütlaç - Taş Fırında Katkısız Güveç Sütlaç | Koç Restaurant',
    metaDesc: 'Samsun Ballıca mevkii ve kampüs yakınlarında en lezzetli fırın sütlaç nerede yenir? Günlük taze köy sütünden yapılan fırın sütlacımız Koç Restaurant\'ta.',
    h1: 'Ballıca Fırın Sütlaç Durağı: Taş Fırından Taze Çıkan Eşsiz Lezzet',
    h2: 'Ballıca Kampüsü ve Çevresindekiler İçin Doğal ve Ekonomik Tatlı Kaçamağı',
    paragraphs: [
      'Ballıca bölgesi, hem eğitim kurumları hem de tütün tarımıyla bilinen Samsun\'un gelişen ve hareketli noktalarından biridir. Üniversite öğrencilerinin, akademisyenlerin ve yerel halkın yoğun olarak bulunduğu bu bölgede, günün yorgunluğunu atmak ve taze, lezzetli bir tatlıyla buluşmak büyük bir keyiftir. Koç Restaurant olarak Ballıca mevkisine de hizmet vererek, meşhur fırın sütlacımızı gençlerin ve lezzet arayanların beğenisine sunuyoruz.',
      'Gençlerin ve tatlı severlerin vazgeçilmezi olan fırın sütlacımız, tamamen doğal köy sütü, pirinç ve pancar şekerinden yapılır. Yapay renklendiriciler veya tatlandırıcılar içermediği için hem hafif hem de son derece sağlıklıdır. Toprak güveçlerde taş fırına sürülerek odun ateşinin ısısıyla üzeri altın sarısı olana dek fırınlanan sütlaçlarımız, fırından çıkar çıkmaz soğutulmaya alınır.',
      'Ballıca\'da ders aralarında, iş çıkışlarında veya sevdiklerinizle bir akşam buluşmasında tercih edebileceğiniz bu hafif Karadeniz klasiği, yanında demli bir çayla harika gider. Üzeri kavrulmuş fındık kırıklarıyla süslenmiş fırın sütlacımızı tatmak ve samimi ortamımızda dinlenmek için Koç Restaurant\'a davetlisiniz.'
    ]
  }
};

export const DistrictSEO: React.FC = () => {
  const { district } = useParams<{ district: string }>();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    restaurantName: 'KOÇ RESTAURANT',
    address: 'Etiler, Nispetiye Cad. No: 12, İstanbul',
    phone: '+90 (212) 555 01 01',
    email: 'rezervasyon@kocrestaurant.com',
    workingHours: 'Her Gün: 12:00 - 00:00',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt',
    facebookUrl: '#',
    instagramUrl: '#'
  });

  const [isLoading, setIsLoading] = useState(true);
  const districtKey = district ? district.replace('-sutlac', '').toLowerCase() : '';
  const data = districtDataMap[districtKey];

  useEffect(() => {
    // Redirect to home if district is not registered
    if (!data && district) {
      navigate('/', { replace: true });
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const settingsRes = await axios.get('/settings');
        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }
      } catch (err) {
        console.error('Error loading settings', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [district, data, navigate]);

  useSEO({
    title: data ? data.title : settings.restaurantName,
    description: data ? data.metaDesc : '',
    keywords: data ? `${data.districtName.toLowerCase()} fırın sütlaç, samsun sütlaç, koç restaurant` : '',
    ogImage: settings.logoUrl || `${window.location.origin}/restaurant-hero.png`
  });

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar
        restaurantName={settings.restaurantName}
        logoUrl={settings.logoUrl}
        settings={settings}
      />

      {/* Hero Header for Article */}
      <section className="pt-32 pb-16 bg-surface-container-low w-full relative overflow-hidden">
        {/* Subtle decorative background overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
          <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">
            Karadeniz Lezzet Durakları / {data.districtName}
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl text-primary mb-6 leading-tight max-w-3xl mx-auto">
            {data.h1}
          </h1>
          <div className="w-16 h-1 bg-secondary mx-auto mb-4"></div>
          <p className="font-body-md text-sm text-on-surface-variant max-w-xl mx-auto italic">
            Yöresel Malzemeler ve Kuşaktan Kuşağa Aktarılan Taş Fırın Reçetesiyle...
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-16">
        <article className="prose prose-stone max-w-none">
          {/* Main Visual Image Banner */}
          <div className="w-full h-80 md:h-[400px] rounded-2xl overflow-hidden mb-12 shadow-md border border-surface-container/60">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop"
              alt={`${data.districtName} Meşhur Taş Fırın Sütlacı`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Subheading */}
          <h2 className="font-display-lg text-2xl md:text-3xl text-primary tracking-tight mb-8">
            {data.h2}
          </h2>

          {/* Article Paragraphs */}
          <div className="space-y-6 text-on-surface-variant font-body-md text-sm md:text-base leading-relaxed">
            {data.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Call to action card */}
          <div className="mt-12 bg-surface-container-low p-8 rounded-2xl border border-surface-container/60 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-display-lg text-xl text-primary">Bu Eşsiz Lezzeti Keşfedin</h3>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Taş fırından taze çıkan, üzeri nar gibi kızarmış fırın sütlacımızı ve diğer geleneksel yemeklerimizi tatmak için menümüzü inceleyin.
              </p>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="bg-primary text-on-primary px-8 py-3.5 rounded-lg font-label-md text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md whitespace-nowrap cursor-pointer"
            >
              Menüyü İncele
            </button>
          </div>
        </article>

        {/* Small footer district list to allow crawlers to easily index other pages */}
        <section className="mt-16 pt-8 border-t border-surface-container-high">
          <h4 className="font-label-md text-xs text-primary uppercase tracking-widest mb-4">Diğer Karadeniz Lezzet Noktalarımız:</h4>
          <div className="flex flex-wrap gap-2.5">
            {Object.values(districtDataMap).map((dist) => (
              <button
                key={dist.slug}
                onClick={() => navigate(`/sutlac/${dist.slug}-sutlac`)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  dist.slug === districtKey
                    ? 'bg-secondary text-on-secondary border-secondary'
                    : 'bg-surface hover:bg-surface-container border-outline-variant/40 text-on-surface-variant'
                }`}
              >
                {dist.districtName} Sütlaç
              </button>
            ))}
          </div>
        </section>
      </main>

      <Footer
        settings={settings}
        activePage="none"
      />
    </div>
  );
};
