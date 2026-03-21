import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Volume2, ChevronLeft, ChevronRight, 
  CheckCircle2, XCircle, BookOpen, Check, Filter, Shuffle,
  Cat, Apple, School, Sun, Activity, Star,
  Users, Smile, Palette, Shirt, Home, Car, Briefcase,
  Carrot, Trophy, Cloud, Clock, MapPin, Gamepad2, Square,
  Leaf, Laptop, Utensils, Box, Coffee, Cake, Gift, Music,
  Bug, Rocket, List, Heart, Tent, MessageCircle
} from 'lucide-react';

/**
 * --- DỮ LIỆU TỪ VỰNG CHO BÉ 8-10 TUỔI (100 TỪ) ---
 * Dữ liệu được nén lại gọn gàng để tối ưu bộ nhớ.
 * Cấu trúc: [Từ tiếng Anh, Phiên âm, Loại từ, Nghĩa tiếng Việt, Câu ví dụ, Nghĩa câu ví dụ, Chủ đề, Emoji]
 */
const RAW_DATA = [
  // --- CHỦ ĐỀ: ĐỘNG VẬT (Animals) ---
  ["Dog", "/dɔːɡ/", "noun", "Con chó", "My dog is very smart.", "Con chó của tớ rất thông minh.", "Động vật", "🐶"],
  ["Cat", "/kæt/", "noun", "Con mèo", "The cat likes to sleep.", "Con mèo thích ngủ.", "Động vật", "🐱"],
  ["Elephant", "/ˈel.ə.fənt/", "noun", "Con voi", "The elephant has a long trunk.", "Con voi có cái vòi dài.", "Động vật", "🐘"],
  ["Lion", "/ˈlaɪ.ən/", "noun", "Sư tử", "The lion is the king of the jungle.", "Sư tử là chúa tể rừng xanh.", "Động vật", "🦁"],
  ["Tiger", "/ˈtaɪ.ɡɚ/", "noun", "Con hổ", "Tigers have stripes.", "Con hổ có vằn.", "Động vật", "🐯"],
  ["Monkey", "/ˈmʌŋ.ki/", "noun", "Con khỉ", "Monkeys love eating bananas.", "Những chú khỉ thích ăn chuối.", "Động vật", "🐒"],
  ["Rabbit", "/ˈræb.ɪt/", "noun", "Con thỏ", "The rabbit runs very fast.", "Con thỏ chạy rất nhanh.", "Động vật", "🐰"],
  ["Bear", "/ber/", "noun", "Con gấu", "The bear is big and brown.", "Con gấu to và có màu nâu.", "Động vật", "🐻"],
  ["Bird", "/bɝːd/", "noun", "Con chim", "The bird is singing in the tree.", "Con chim đang hót trên cây.", "Động vật", "🐦"],
  ["Fish", "/fɪʃ/", "noun", "Con cá", "Fish swim in the water.", "Cá bơi trong nước.", "Động vật", "🐟"],
  ["Horse", "/hɔːrs/", "noun", "Con ngựa", "I want to ride a horse.", "Tớ muốn cưỡi ngựa.", "Động vật", "🐴"],
  ["Cow", "/kaʊ/", "noun", "Con bò", "Cows give us milk.", "Bò cho chúng ta sữa.", "Động vật", "🐮"],
  ["Pig", "/pɪɡ/", "noun", "Con lợn", "The pig is pink and cute.", "Con lợn màu hồng và dễ thương.", "Động vật", "🐷"],
  ["Sheep", "/ʃiːp/", "noun", "Con cừu", "Sheep have soft wool.", "Cừu có bộ lông mềm mại.", "Động vật", "🐑"],
  ["Chicken", "/ˈtʃɪk.ɪn/", "noun", "Con gà", "The chicken is in the farm.", "Con gà đang ở nông trại.", "Động vật", "🐔"],
  ["Duck", "/dʌk/", "noun", "Con vịt", "The duck is swimming.", "Con vịt đang bơi.", "Động vật", "🦆"],
  ["Snake", "/sneɪk/", "noun", "Con rắn", "Snakes have no legs.", "Rắn không có chân.", "Động vật", "🐍"],
  ["Crocodile", "/ˈkrɑː.kə.daɪl/", "noun", "Cá sấu", "Crocodiles have big teeth.", "Cá sấu có hàm răng lớn.", "Động vật", "🐊"],
  ["Penguin", "/ˈpeŋ.ɡwɪn/", "noun", "Chim cánh cụt", "Penguins live in the cold.", "Chim cánh cụt sống ở nơi lạnh giá.", "Động vật", "🐧"],
  ["Dolphin", "/ˈdɑːl.fɪn/", "noun", "Cá heo", "Dolphins are very friendly.", "Cá heo rất thân thiện.", "Động vật", "🐬"],

  // --- CHỦ ĐỀ: TRƯỜNG HỌC (School) ---
  ["Pen", "/pen/", "noun", "Cái bút mực", "I write with a blue pen.", "Tớ viết bằng một chiếc bút màu xanh.", "Trường học", "🖊️"],
  ["Pencil", "/ˈpen.səl/", "noun", "Cái bút chì", "Can I borrow your pencil?", "Tớ mượn bút chì của bạn được không?", "Trường học", "✏️"],
  ["Book", "/bʊk/", "noun", "Quyển sách", "I read a book before bed.", "Tớ đọc sách trước khi đi ngủ.", "Trường học", "📚"],
  ["Notebook", "/ˈnoʊt.bʊk/", "noun", "Quyển vở", "Write the words in your notebook.", "Hãy viết các từ vào vở của em.", "Trường học", "📓"],
  ["Ruler", "/ˈruː.lɚ/", "noun", "Cái thước kẻ", "The ruler is long.", "Chiếc thước kẻ này rất dài.", "Trường học", "📏"],
  ["Eraser", "/ɪˈreɪ.sɚ/", "noun", "Cục tẩy", "Use the eraser to fix the mistake.", "Dùng tẩy để sửa lỗi sai nhé.", "Trường học", "🧼"],
  ["Bag", "/bæɡ/", "noun", "Cái cặp sách", "My bag is heavy.", "Cặp sách của tớ rất nặng.", "Trường học", "🎒"],
  ["Teacher", "/ˈtiː.tʃɚ/", "noun", "Giáo viên", "My teacher is very kind.", "Giáo viên của tớ rất hiền.", "Trường học", "👩‍🏫"],
  ["Student", "/ˈstuː.dənt/", "noun", "Học sinh", "He is a good student.", "Cậu ấy là một học sinh ngoan.", "Trường học", "🎓"],
  ["Classroom", "/ˈklæs.ruːm/", "noun", "Phòng học", "Our classroom is clean.", "Phòng học của chúng tớ rất sạch.", "Trường học", "🏫"],

  // --- CHỦ ĐỀ: ĐỒ ĂN (Food) ---
  ["Apple", "/ˈæp.əl/", "noun", "Quả táo", "I eat an apple every day.", "Tớ ăn một quả táo mỗi ngày.", "Đồ ăn", "🍎"],
  ["Banana", "/bəˈnæn.ə/", "noun", "Quả chuối", "Monkeys like bananas.", "Khỉ thích chuối.", "Đồ ăn", "🍌"],
  ["Water", "/ˈwɑː.t̬ɚ/", "noun", "Nước", "We need to drink water.", "Chúng ta cần uống nước.", "Đồ ăn", "💧"],
  ["Rice", "/raɪs/", "noun", "Gạo, Cơm", "I eat rice with chicken.", "Tớ ăn cơm với gà.", "Đồ ăn", "🍚"],
  ["Milk", "/mɪlk/", "noun", "Sữa", "Drink milk to be strong.", "Hãy uống sữa để khỏe mạnh.", "Đồ ăn", "🥛"],
  ["Bread", "/bred/", "noun", "Bánh mì", "I have bread for breakfast.", "Tớ ăn bánh mì vào bữa sáng.", "Đồ ăn", "🍞"],
  ["Egg", "/eɡ/", "noun", "Quả trứng", "There is an egg in the box.", "Có một quả trứng trong hộp.", "Đồ ăn", "🥚"],
  ["Meat", "/miːt/", "noun", "Thịt", "My brother likes eating meat.", "Anh trai tớ thích ăn thịt.", "Đồ ăn", "🥩"],
  ["Pizza", "/ˈpiːt.sə/", "noun", "Bánh pizza", "We eat pizza on Sunday.", "Chúng tớ ăn pizza vào Chủ Nhật.", "Đồ ăn", "🍕"],
  ["Cake", "/keɪk/", "noun", "Bánh ngọt", "Happy birthday! Here is your cake.", "Chúc mừng sinh nhật! Bánh của bạn đây.", "Đồ ăn", "🎂"],

  // --- CHỦ ĐỀ: THIÊN NHIÊN (Nature) ---
  ["Sun", "/sʌn/", "noun", "Mặt trời", "The sun is hot.", "Mặt trời rất nóng.", "Thiên nhiên", "☀️"],
  ["Moon", "/muːn/", "noun", "Mặt trăng", "I see the moon at night.", "Tớ thấy mặt trăng vào ban đêm.", "Thiên nhiên", "🌙"],
  ["Star", "/stɑːr/", "noun", "Ngôi sao", "The stars are twinkling.", "Những ngôi sao đang lấp lánh.", "Thiên nhiên", "⭐"],
  ["Rain", "/reɪn/", "noun", "Cơn mưa", "I like to play in the rain.", "Tớ thích chơi dưới mưa.", "Thiên nhiên", "🌧️"],
  ["Tree", "/triː/", "noun", "Cái cây", "The tree is tall and green.", "Cái cây cao và xanh tươi.", "Thiên nhiên", "🌳"],
  ["Flower", "/ˈflaʊ.ɚ/", "noun", "Bông hoa", "This flower smells good.", "Bông hoa này có mùi rất thơm.", "Thiên nhiên", "🌸"],
  ["River", "/ˈrɪv.ɚ/", "noun", "Dòng sông", "Fish swim in the river.", "Cá bơi dưới sông.", "Thiên nhiên", "🏞️"],
  ["Mountain", "/ˈmaʊn.tən/", "noun", "Ngọn núi", "The mountain is very high.", "Ngọn núi này rất cao.", "Thiên nhiên", "⛰️"],
  ["Beach", "/biːtʃ/", "noun", "Bãi biển", "We play on the beach.", "Chúng tớ chơi đùa trên bãi biển.", "Thiên nhiên", "🏖️"],
  ["Forest", "/ˈfɔːr.ɪst/", "noun", "Khu rừng", "Many animals live in the forest.", "Nhiều loài vật sống trong rừng.", "Thiên nhiên", "🌲"],

  // --- CHỦ ĐỀ: GIA ĐÌNH (Family) ---
  ["Father", "/ˈfɑː.ðɚ/", "noun", "Bố", "My father is very strong.", "Bố tớ rất khỏe.", "Gia đình", "👨"],
  ["Mother", "/ˈmʌð.ɚ/", "noun", "Mẹ", "My mother cooks well.", "Mẹ tớ nấu ăn rất ngon.", "Gia đình", "👩"],
  ["Brother", "/ˈbrʌð.ɚ/", "noun", "Anh/em trai", "I play games with my brother.", "Tớ chơi điện tử với em trai.", "Gia đình", "👦"],
  ["Sister", "/ˈsɪs.tɚ/", "noun", "Chị/em gái", "My sister draws beautifully.", "Chị tớ vẽ rất đẹp.", "Gia đình", "👧"],
  ["Grandpa", "/ˈɡræn.pɑː/", "noun", "Ông", "Grandpa tells good stories.", "Ông tớ kể chuyện rất hay.", "Gia đình", "👴"],
  ["Grandma", "/ˈɡræn.mɑː/", "noun", "Bà", "Grandma loves me.", "Bà ngoại rất thương tớ.", "Gia đình", "👵"],
  ["Uncle", "/ˈʌŋ.kəl/", "noun", "Chú/bác trai", "My uncle gives me a toy.", "Chú tớ tặng tớ một món đồ chơi.", "Gia đình", "👨‍💼"],
  ["Aunt", "/ænt/", "noun", "Cô/dì", "My aunt is very kind.", "Dì tớ rất hiền.", "Gia đình", "👩‍💼"],
  ["Baby", "/ˈbeɪ.bi/", "noun", "Em bé", "The baby is sleeping.", "Em bé đang ngủ.", "Gia đình", "👶"],
  ["Family", "/ˈfæm.əl.i/", "noun", "Gia đình", "I love my family.", "Tớ yêu gia đình tớ.", "Gia đình", "🏡"],

  // --- CHỦ ĐỀ: CƠ THỂ MÌNH (Body Parts) ---
  ["Head", "/hed/", "noun", "Đầu", "Nod your head.", "Hãy gật đầu của bạn.", "Cơ thể", "🗣️"],
  ["Hair", "/her/", "noun", "Tóc", "She has long hair.", "Cô ấy có mái tóc dài.", "Cơ thể", "💇"],
  ["Eye", "/aɪ/", "noun", "Mắt", "I see with my eyes.", "Tớ nhìn bằng mắt.", "Cơ thể", "👀"],
  ["Ear", "/ɪr/", "noun", "Tai", "I listen with my ears.", "Tớ nghe bằng tai.", "Cơ thể", "👂"],
  ["Nose", "/noʊz/", "noun", "Mũi", "I smell a flower with my nose.", "Tớ ngửi hoa bằng mũi.", "Cơ thể", "👃"],
  ["Mouth", "/maʊθ/", "noun", "Miệng", "Open your mouth.", "Há miệng ra nào.", "Cơ thể", "👄"],
  ["Tooth", "/tuːθ/", "noun", "Cái răng", "I brush my teeth.", "Tớ đánh răng.", "Cơ thể", "🦷"],
  ["Hand", "/hænd/", "noun", "Bàn tay", "Wash your hands.", "Hãy rửa tay.", "Cơ thể", "🖐️"],
  ["Finger", "/ˈfɪŋ.ɡɚ/", "noun", "Ngón tay", "I have ten fingers.", "Tớ có mười ngón tay.", "Cơ thể", "☝️"],
  ["Foot", "/fʊt/", "noun", "Bàn chân", "My right foot hurts.", "Chân phải tớ bị đau.", "Cơ thể", "🦶"],

  // --- CHỦ ĐỀ: MÀU SẮC (Colors) ---
  ["Red", "/red/", "adj", "Màu đỏ", "An apple is red.", "Quả táo có màu đỏ.", "Màu sắc", "🔴"],
  ["Blue", "/bluː/", "adj", "Màu xanh dương", "The sky is blue.", "Bầu trời màu xanh dương.", "Màu sắc", "🔵"],
  ["Green", "/ɡriːn/", "adj", "Màu xanh lá", "A leaf is green.", "Chiếc lá màu xanh lá.", "Màu sắc", "🟢"],
  ["Yellow", "/ˈjel.oʊ/", "adj", "Màu vàng", "The sun is yellow.", "Mặt trời màu vàng.", "Màu sắc", "🟡"],
  ["Black", "/blæk/", "adj", "Màu đen", "The cat is black.", "Con mèo màu đen.", "Màu sắc", "⚫"],
  ["White", "/waɪt/", "adj", "Màu trắng", "The snow is white.", "Tuyết màu trắng.", "Màu sắc", "⚪"],
  ["Orange", "/ˈɔːr.ɪndʒ/", "adj", "Màu cam", "An orange is orange.", "Quả cam có màu cam.", "Màu sắc", "🟠"],
  ["Pink", "/pɪŋk/", "adj", "Màu hồng", "She wears a pink dress.", "Cô ấy mặc chiếc váy màu hồng.", "Màu sắc", "🎀"],
  ["Purple", "/ˈpɝː.pəl/", "adj", "Màu tím", "I like purple flowers.", "Tớ thích hoa màu tím.", "Màu sắc", "🟣"],
  ["Brown", "/braʊn/", "adj", "Màu nâu", "The bear is brown.", "Con gấu màu nâu.", "Màu sắc", "🟤"],

  // --- CHỦ ĐỀ: QUẦN ÁO (Clothes) ---
  ["Shirt", "/ʃɝːt/", "noun", "Áo sơ mi", "He wears a white shirt.", "Anh ấy mặc áo sơ mi trắng.", "Quần áo", "👕"],
  ["Pants", "/pænts/", "noun", "Quần dài", "My pants are blue.", "Quần của tớ màu xanh.", "Quần áo", "👖"],
  ["Dress", "/dres/", "noun", "Váy liền", "The dress is beautiful.", "Chiếc váy thật đẹp.", "Quần áo", "👗"],
  ["Skirt", "/skɝːt/", "noun", "Chân váy", "She has a red skirt.", "Cô ấy có chiếc chân váy màu đỏ.", "Quần áo", "🥻"],
  ["Shoe", "/ʃuː/", "noun", "Chiếc giày", "Put on your shoes.", "Hãy mang giày vào.", "Quần áo", "👞"],
  ["Sock", "/sɑːk/", "noun", "Chiếc tất", "These socks are warm.", "Đôi tất này rất ấm.", "Quần áo", "🧦"],
  ["Hat", "/hæt/", "noun", "Cái mũ", "The sun is hot, wear a hat.", "Nắng rất gắt, hãy đội mũ vào.", "Quần áo", "👒"],
  ["Jacket", "/ˈdʒæk.ɪt/", "noun", "Áo khoác", "It's cold, need a jacket.", "Trời lạnh rồi, tớ cần một cái áo khoác.", "Quần áo", "🧥"],
  ["Scarf", "/skɑːrf/", "noun", "Khăn quàng cổ", "Wrap the scarf around your neck.", "Quàng chiếc khăn quanh cổ nhé.", "Quần áo", "🧣"],
  ["Glasses", "/ˈɡlæs.ɪz/", "noun", "Kính mắt", "He wears glasses to read.", "Anh ấy đeo kính để đọc sách.", "Quần áo", "👓"],

  // --- CHỦ ĐỀ: ĐỒ VẬT TRONG NHÀ (House) ---
  ["Bed", "/bed/", "noun", "Cái giường", "I sleep in my bed.", "Tớ ngủ trên giường.", "Nhà cửa", "🛏️"],
  ["Table", "/ˈteɪ.bəl/", "noun", "Cái bàn", "The book is on the table.", "Quyển sách ở trên bàn.", "Nhà cửa", "🪵"],
  ["Sofa", "/ˈsoʊ.fə/", "noun", "Ghế sô-pha", "We sit on the sofa.", "Chúng tớ ngồi trên ghế sô-pha.", "Nhà cửa", "🛋️"],
  ["Lamp", "/læmp/", "noun", "Cái đèn", "Turn on the lamp, please.", "Làm ơn bật đèn lên.", "Nhà cửa", "🛋️"],
  ["Television", "/ˈtel.ə.vɪʒ.ən/", "noun", "Tivi", "We watch a movie on TV.", "Chúng tớ xem phim trên tivi.", "Nhà cửa", "📺"],
  ["Fan", "/fæn/", "noun", "Cái quạt", "It is hot, turn on the fan.", "Trời nóng, hãy bật quạt lên.", "Nhà cửa", "💨"],
  ["Door", "/dɔːr/", "noun", "Cánh cửa", "Open the door.", "Hãy mở cửa ra.", "Nhà cửa", "🚪"],
  ["Window", "/ˈwɪn.doʊ/", "noun", "Cửa sổ", "Look out the window.", "Nhìn ra ngoài cửa sổ nào.", "Nhà cửa", "🪟"],
  ["Key", "/kiː/", "noun", "Chìa khóa", "I lost my key.", "Tớ làm mất chìa khóa rồi.", "Nhà cửa", "🔑"],
  ["Mirror", "/ˈmɪr.ɚ/", "noun", "Cái gương", "Look in the mirror.", "Hãy nhìn vào gương.", "Nhà cửa", "🪞"],

  // --- CHỦ ĐỀ: PHƯƠNG TIỆN (Vehicles) ---
  ["Car", "/kɑːr/", "noun", "Ô tô", "My dad drives a car.", "Bố tớ lái ô tô.", "Phương tiện", "🚗"],
  ["Bus", "/bʌs/", "noun", "Xe buýt", "I go to school by bus.", "Tớ đi học bằng xe buýt.", "Phương tiện", "🚌"],
  ["Train", "/treɪn/", "noun", "Tàu hỏa", "The train is very long.", "Đoàn tàu rất dài.", "Phương tiện", "🚆"],
  ["Bicycle", "/ˈbaɪ.sə.kəl/", "noun", "Xe đạp", "I ride my bicycle to the park.", "Tớ đạp xe ra công viên.", "Phương tiện", "🚲"],
  ["Motorcycle", "/ˈmoʊ.t̬ɚˌsaɪ.kəl/", "noun", "Xe máy", "He rides a motorcycle.", "Anh ấy đi xe máy.", "Phương tiện", "🏍️"],
  ["Airplane", "/ˈer.pleɪn/", "noun", "Máy bay", "The airplane flies in the sky.", "Máy bay bay trên bầu trời.", "Phương tiện", "✈️"],
  ["Boat", "/boʊt/", "noun", "Cái thuyền", "The boat is on the river.", "Chiếc thuyền ở trên sông.", "Phương tiện", "⛵"],
  ["Ship", "/ʃɪp/", "noun", "Tàu thủy", "The ship is very big.", "Con tàu thủy rất lớn.", "Phương tiện", "🚢"],
  ["Truck", "/trʌk/", "noun", "Xe tải", "The truck carries heavy things.", "Xe tải chở đồ nặng.", "Phương tiện", "🛻"],
  ["Helicopter", "/ˈhel.əˌkɑːp.tɚ/", "noun", "Trực thăng", "The helicopter goes up.", "Trực thăng bay lên.", "Phương tiện", "🚁"],

  // --- CHỦ ĐỀ: NGHỀ NGHIỆP (Jobs) ---
  ["Doctor", "/ˈdɑːk.tɚ/", "noun", "Bác sĩ", "The doctor helps sick people.", "Bác sĩ giúp người bệnh.", "Nghề nghiệp", "👨‍⚕️"],
  ["Nurse", "/nɝːs/", "noun", "Y tá", "The nurse works in a hospital.", "Y tá làm việc trong bệnh viện.", "Nghề nghiệp", "👩‍⚕️"],
  ["Police", "/pəˈliːs/", "noun", "Cảnh sát", "The police catch bad guys.", "Cảnh sát bắt kẻ xấu.", "Nghề nghiệp", "👮"],
  ["Firefighter", "/ˈfaɪrˌfaɪ.t̬ɚ/", "noun", "Lính cứu hỏa", "Firefighters put out fires.", "Lính cứu hỏa dập tắt đám cháy.", "Nghề nghiệp", "🧑‍🚒"],
  ["Farmer", "/ˈfɑːr.mɚ/", "noun", "Nông dân", "The farmer grows vegetables.", "Bác nông dân trồng rau.", "Nghề nghiệp", "👨‍🌾"],
  ["Singer", "/ˈsɪŋ.ɚ/", "noun", "Ca sĩ", "The singer sings a song.", "Ca sĩ hát một bài hát.", "Nghề nghiệp", "🎤"],
  ["Dancer", "/ˈdæn.sɚ/", "noun", "Vũ công", "The dancer dances beautifully.", "Vũ công múa rất đẹp.", "Nghề nghiệp", "💃"],
  ["Driver", "/ˈdraɪ.vɚ/", "noun", "Tài xế", "The bus driver is careful.", "Bác tài xế xe buýt rất cẩn thận.", "Nghề nghiệp", "🧑‍✈️"],
  ["Chef", "/ʃef/", "noun", "Đầu bếp", "The chef cooks good food.", "Đầu bếp nấu món ăn ngon.", "Nghề nghiệp", "🧑‍🍳"],
  ["Pilot", "/ˈpaɪ.lət/", "noun", "Phi công", "The pilot flies an airplane.", "Phi công lái máy bay.", "Nghề nghiệp", "🧑‍✈️"],

  // --- CHỦ ĐỀ: TRÁI CÂY (Fruits) ---
  ["Mango", "/ˈmæŋ.ɡoʊ/", "noun", "Quả xoài", "This mango is very sweet.", "Quả xoài này rất ngọt.", "Trái cây", "🥭"],
  ["Pineapple", "/ˈpaɪnˌæp.əl/", "noun", "Quả dứa", "I like pineapple juice.", "Tớ thích nước ép dứa.", "Trái cây", "🍍"],
  ["Peach", "/piːtʃ/", "noun", "Quả đào", "The peach is soft.", "Quả đào rất mềm.", "Trái cây", "🍑"],
  ["Lemon", "/ˈlem.ən/", "noun", "Quả chanh vàng", "Lemon is sour.", "Chanh có vị chua.", "Trái cây", "🍋"],
  ["Cherry", "/ˈtʃer.i/", "noun", "Quả anh đào", "I eat a red cherry.", "Tớ ăn một quả anh đào đỏ.", "Trái cây", "🍒"],
  ["Pear", "/per/", "noun", "Quả lê", "The pear is green.", "Quả lê màu xanh.", "Trái cây", "🍐"],
  ["Coconut", "/ˈkoʊ.kə.nʌt/", "noun", "Quả dừa", "Coconut water is fresh.", "Nước dừa rất mát.", "Trái cây", "🥥"],
  ["Papaya", "/pəˈpaɪ.ə/", "noun", "Quả đu đủ", "Papaya is good for you.", "Đu đủ rất tốt cho bạn.", "Trái cây", "🍈"],
  ["Guava", "/ˈɡwɑː.və/", "noun", "Quả ổi", "I eat a raw guava.", "Tớ ăn một quả ổi xanh.", "Trái cây", "🍏"],
  ["Plum", "/plʌm/", "noun", "Quả mận", "The plum is purple.", "Quả mận màu tím.", "Trái cây", "🫐"],

  // --- CHỦ ĐỀ: RAU CỦ (Vegetables) ---
  ["Tomato", "/təˈmeɪ.t̬oʊ/", "noun", "Quả cà chua", "Tomato is red.", "Cà chua có màu đỏ.", "Rau củ", "🍅"],
  ["Potato", "/pəˈteɪ.t̬oʊ/", "noun", "Củ khoai tây", "I like potato chips.", "Tớ thích khoai tây chiên.", "Rau củ", "🥔"],
  ["Carrot", "/ˈkær.ət/", "noun", "Củ cà rốt", "Rabbits eat carrots.", "Thỏ ăn cà rốt.", "Rau củ", "🥕"],
  ["Onion", "/ˈʌn.jən/", "noun", "Củ hành", "The onion makes me cry.", "Củ hành làm tớ khóc.", "Rau củ", "🧅"],
  ["Garlic", "/ˈɡɑːr.lɪk/", "noun", "Củ tỏi", "Garlic smells strong.", "Tỏi có mùi rất nồng.", "Rau củ", "🧄"],
  ["Cabbage", "/ˈkæb.ɪdʒ/", "noun", "Bắp cải", "Cabbage is a green vegetable.", "Bắp cải là một loại rau xanh.", "Rau củ", "🥬"],
  ["Corn", "/kɔːrn/", "noun", "Bắp ngô", "I eat sweet corn.", "Tớ ăn ngô ngọt.", "Rau củ", "🌽"],
  ["Mushroom", "/ˈmʌʃ.ruːm/", "noun", "Cây nấm", "The mushroom is small.", "Cây nấm nhỏ bé.", "Rau củ", "🍄"],
  ["Cucumber", "/ˈkjuː.kʌm.bɚ/", "noun", "Dưa chuột", "Cucumber helps cool down.", "Dưa chuột giúp giải nhiệt.", "Rau củ", "🥒"],
  ["Pumpkin", "/ˈpʌmp.kɪn/", "noun", "Quả bí ngô", "We carve a pumpkin for Halloween.", "Chúng tớ khắc bí ngô cho lễ Halloween.", "Rau củ", "🎃"],

  // --- CHỦ ĐỀ: THỂ THAO (Sports) ---
  ["Football", "/ˈfʊt.bɑːl/", "noun", "Bóng đá", "We play football on the field.", "Chúng tớ chơi bóng đá trên sân.", "Thể thao", "⚽"],
  ["Basketball", "/ˈbæs.kət.bɑːl/", "noun", "Bóng rổ", "He throws the basketball.", "Cậu ấy ném quả bóng rổ.", "Thể thao", "🏀"],
  ["Tennis", "/ˈten.ɪs/", "noun", "Quần vợt", "They play tennis together.", "Họ chơi quần vợt cùng nhau.", "Thể thao", "🎾"],
  ["Badminton", "/ˈbæd.mɪn.tən/", "noun", "Cầu lông", "I play badminton with my sister.", "Tớ đánh cầu lông với em gái.", "Thể thao", "🏸"],
  ["Volleyball", "/ˈvɑː.li.bɑːl/", "noun", "Bóng chuyền", "We hit the volleyball.", "Chúng tớ đánh bóng chuyền.", "Thể thao", "🏐"],
  ["Baseball", "/ˈbeɪs.bɑːl/", "noun", "Bóng chày", "He hits the baseball with a bat.", "Cậu ấy đánh quả bóng chày bằng gậy.", "Thể thao", "⚾"],
  ["Swimming", "/ˈswɪm.ɪŋ/", "noun", "Bơi lội", "Swimming is good exercise.", "Bơi lội là môn thể thao tốt.", "Thể thao", "🏊‍♂️"],
  ["Running", "/ˈrʌn.ɪŋ/", "noun", "Điền kinh/chạy", "She is good at running.", "Cô ấy chạy rất giỏi.", "Thể thao", "🏃‍♀️"],
  ["Cycling", "/ˈsaɪ.klɪŋ/", "noun", "Đạp xe", "Cycling makes my legs strong.", "Đạp xe giúp chân tớ khỏe.", "Thể thao", "🚴"],
  ["Karate", "/kəˈrɑː.t̬i/", "noun", "Võ Karate", "He learns karate to be strong.", "Cậu ấy học karate để mạnh mẽ hơn.", "Thể thao", "🥋"],

  // --- CHỦ ĐỀ: THỜI TIẾT (Weather) ---
  ["Sunny", "/ˈsʌn.i/", "adj", "Trời nắng", "Today is a sunny day.", "Hôm nay là một ngày nắng.", "Thời tiết", "☀️"],
  ["Rainy", "/ˈreɪ.ni/", "adj", "Trời mưa", "It is rainy, take an umbrella.", "Trời mưa rồi, hãy mang theo ô.", "Thời tiết", "🌧️"],
  ["Cloudy", "/ˈklaʊ.di/", "adj", "Nhiều mây", "The sky is cloudy.", "Bầu trời có nhiều mây.", "Thời tiết", "☁️"],
  ["Windy", "/ˈwɪn.di/", "adj", "Có gió", "It is windy today.", "Hôm nay trời có gió.", "Thời tiết", "🌬️"],
  ["Snowy", "/ˈsnoʊ.i/", "adj", "Có tuyết", "The weather is snowy and cold.", "Trời có tuyết và lạnh.", "Thời tiết", "❄️"],
  ["Hot", "/hɑːt/", "adj", "Nóng", "Summer is very hot.", "Mùa hè rất nóng.", "Thời tiết", "🥵"],
  ["Cold", "/koʊld/", "adj", "Lạnh", "Winter is very cold.", "Mùa đông rất lạnh.", "Thời tiết", "🥶"],
  ["Warm", "/wɔːrm/", "adj", "Ấm áp", "Spring is warm.", "Mùa xuân thật ấm áp.", "Thời tiết", "🌸"],
  ["Cool", "/kuːl/", "adj", "Mát mẻ", "Autumn is cool.", "Mùa thu thật mát mẻ.", "Thời tiết", "🍂"],
  ["Stormy", "/ˈstɔːr.mi/", "adj", "Có bão", "A stormy night is scary.", "Một đêm giông bão thật đáng sợ.", "Thời tiết", "🌩️"],

  // --- CHỦ ĐỀ: THỜI GIAN (Time) ---
  ["Morning", "/ˈmɔːr.nɪŋ/", "noun", "Buổi sáng", "I wake up in the morning.", "Tớ thức dậy vào buổi sáng.", "Thời gian", "🌅"],
  ["Afternoon", "/ˌæf.tɚˈnuːn/", "noun", "Buổi chiều", "I play in the afternoon.", "Tớ chơi vào buổi chiều.", "Thời gian", "🌇"],
  ["Evening", "/ˈiːv.nɪŋ/", "noun", "Buổi tối", "I watch TV in the evening.", "Tớ xem TV vào buổi tối.", "Thời gian", "🌃"],
  ["Night", "/naɪt/", "noun", "Đêm", "I sleep at night.", "Tớ ngủ vào ban đêm.", "Thời gian", "🌙"],
  ["Today", "/təˈdeɪ/", "noun", "Hôm nay", "Today is Monday.", "Hôm nay là thứ Hai.", "Thời gian", "📅"],
  ["Tomorrow", "/təˈmɔːr.oʊ/", "noun", "Ngày mai", "Tomorrow is my birthday.", "Ngày mai là sinh nhật tớ.", "Thời gian", "🎂"],
  ["Yesterday", "/ˈjes.tɚ.deɪ/", "noun", "Hôm qua", "Yesterday was cold.", "Hôm qua trời lạnh.", "Thời gian", "🥶"],
  ["Week", "/wiːk/", "noun", "Tuần lễ", "There are seven days in a week.", "Có bảy ngày trong một tuần.", "Thời gian", "🗓️"],
  ["Month", "/mʌnθ/", "noun", "Tháng", "My favorite month is May.", "Tháng yêu thích của tớ là tháng Năm.", "Thời gian", "📆"],
  ["Year", "/jɪr/", "noun", "Năm", "Happy New Year!", "Chúc mừng năm mới!", "Thời gian", "🎆"],

  // --- CHỦ ĐỀ: NƠI CHỐN (Places) ---
  ["School", "/skuːl/", "noun", "Trường học", "I go to school every day.", "Tớ đến trường mỗi ngày.", "Nơi chốn", "🏫"],
  ["Home", "/hoʊm/", "noun", "Nhà", "I go home after school.", "Tớ về nhà sau khi tan học.", "Nơi chốn", "🏠"],
  ["Park", "/pɑːrk/", "noun", "Công viên", "We play in the park.", "Chúng tớ chơi trong công viên.", "Nơi chốn", "🏞️"],
  ["Zoo", "/zuː/", "noun", "Sở thú", "I see lions at the zoo.", "Tớ thấy sư tử ở sở thú.", "Nơi chốn", "🦁"],
  ["Hospital", "/ˈhɑː.spɪ.t̬əl/", "noun", "Bệnh viện", "The doctor is in the hospital.", "Bác sĩ ở trong bệnh viện.", "Nơi chốn", "🏥"],
  ["Supermarket", "/ˈsuː.pɚˌmɑːr.kɪt/", "noun", "Siêu thị", "We buy food at the supermarket.", "Chúng tớ mua thức ăn ở siêu thị.", "Nơi chốn", "🛒"],
  ["Library", "/ˈlaɪ.brer.i/", "noun", "Thư viện", "I read books in the library.", "Tớ đọc sách trong thư viện.", "Nơi chốn", "📚"],
  ["Cinema", "/ˈsɪn.ə.mə/", "noun", "Rạp chiếu phim", "We watch a movie at the cinema.", "Chúng tớ xem phim ở rạp chiếu phim.", "Nơi chốn", "🎬"],
  ["Restaurant", "/ˈres.tə.rɑːnt/", "noun", "Nhà hàng", "We eat pizza at the restaurant.", "Chúng tớ ăn pizza ở nhà hàng.", "Nơi chốn", "🍽️"],
  ["Beach", "/biːtʃ/", "noun", "Bãi biển", "We swim at the beach.", "Chúng tớ bơi ở bãi biển.", "Nơi chốn", "🏖️"],

  // --- CHỦ ĐỀ: ĐỒ CHƠI (Toys) ---
  ["Doll", "/dɑːl/", "noun", "Búp bê", "She plays with her doll.", "Cô bé chơi với búp bê.", "Đồ chơi", "🪆"],
  ["Ball", "/bɑːl/", "noun", "Quả bóng", "I throw the ball.", "Tớ ném quả bóng.", "Đồ chơi", "⚽"],
  ["Kite", "/kaɪt/", "noun", "Cái diều", "The kite flies high.", "Con diều bay cao.", "Đồ chơi", "🪁"],
  ["Teddy bear", "/ˈted.i ˌber/", "noun", "Gấu bông", "I hug my teddy bear.", "Tớ ôm gấu bông của tớ.", "Đồ chơi", "🧸"],
  ["Puzzle", "/ˈpʌz.əl/", "noun", "Bộ xếp hình", "We do a puzzle together.", "Chúng tớ cùng chơi xếp hình.", "Đồ chơi", "🧩"],
  ["Robot", "/ˈroʊ.bɑːt/", "noun", "Người máy", "My robot can walk.", "Con rô-bốt của tớ biết đi.", "Đồ chơi", "🤖"],
  ["Train toy", "/treɪn tɔɪ/", "noun", "Tàu hỏa đồ chơi", "The toy train goes choo-choo.", "Tàu hỏa đồ chơi kêu xình xịch.", "Đồ chơi", "🚂"],
  ["Blocks", "/blɑːks/", "noun", "Khối xếp hình", "He builds a tower with blocks.", "Cậu bé xây tháp bằng khối xếp hình.", "Đồ chơi", "🧱"],
  ["Yo-yo", "/ˈjoʊ.joʊ/", "noun", "Con quay yo-yo", "The yo-yo goes up and down.", "Con quay yo-yo đi lên và đi xuống.", "Đồ chơi", "🪀"],
  ["Car toy", "/kɑːr tɔɪ/", "noun", "Xe đồ chơi", "I race my toy car.", "Tớ đua xe đồ chơi của tớ.", "Đồ chơi", "🏎️"],

  // --- CHỦ ĐỀ: HÌNH KHỐI (Shapes) ---
  ["Circle", "/ˈsɝː.kəl/", "noun", "Hình tròn", "The sun is a circle.", "Mặt trời là một hình tròn.", "Hình khối", "⭕"],
  ["Square", "/skwer/", "noun", "Hình vuông", "The box is a square.", "Cái hộp là một hình vuông.", "Hình khối", "🟩"],
  ["Triangle", "/ˈtraɪ.æŋ.ɡəl/", "noun", "Hình tam giác", "A pizza slice is a triangle.", "Một miếng pizza là hình tam giác.", "Hình khối", "🔺"],
  ["Rectangle", "/ˈrek.tæŋ.ɡəl/", "noun", "Hình chữ nhật", "The door is a rectangle.", "Cánh cửa là hình chữ nhật.", "Hình khối", "🟦"],
  ["Star", "/stɑːr/", "noun", "Hình ngôi sao", "Draw a star.", "Hãy vẽ một hình ngôi sao.", "Hình khối", "⭐"],
  ["Heart", "/hɑːrt/", "noun", "Hình trái tim", "I draw a red heart.", "Tớ vẽ một hình trái tim màu đỏ.", "Hình khối", "❤️"],
  ["Oval", "/ˈoʊ.vəl/", "noun", "Hình bầu dục", "An egg is an oval.", "Quả trứng có hình bầu dục.", "Hình khối", "🥚"],
  ["Diamond", "/ˈdaɪ.mənd/", "noun", "Hình thoi", "The kite is a diamond.", "Con diều có hình thoi.", "Hình khối", "♦️"],
  ["Cross", "/krɑːs/", "noun", "Hình chữ thập", "The hospital sign is a cross.", "Biển bệnh viện có hình chữ thập.", "Hình khối", "➕"],
  ["Arrow", "/ˈer.oʊ/", "noun", "Hình mũi tên", "Follow the arrow.", "Hãy đi theo mũi tên.", "Hình khối", "➡️"],

  // --- CHỦ ĐỀ: CẢM XÚC (Emotions) ---
  ["Happy", "/ˈhæp.i/", "adj", "Vui vẻ", "I am very happy today.", "Hôm nay tớ rất vui.", "Cảm xúc", "😄"],
  ["Sad", "/sæd/", "adj", "Buồn bã", "Don't be sad.", "Đừng buồn nhé.", "Cảm xúc", "😢"],
  ["Angry", "/ˈæŋ.ɡri/", "adj", "Tức giận", "The cat is angry.", "Con mèo đang tức giận.", "Cảm xúc", "😠"],
  ["Scared", "/skerd/", "adj", "Sợ hãi", "Are you scared of ghosts?", "Bạn có sợ ma không?", "Cảm xúc", "😨"],
  ["Surprised", "/sɚˈpraɪzd/", "adj", "Ngạc nhiên", "I am surprised by the gift.", "Tớ rất ngạc nhiên vì món quà.", "Cảm xúc", "😲"],
  ["Tired", "/taɪɚd/", "adj", "Mệt mỏi", "I am tired after running.", "Tớ thấy mệt sau khi chạy.", "Cảm xúc", "😫"],
  ["Bored", "/bɔːrd/", "adj", "Chán nản", "I am bored, let's play.", "Tớ chán quá, cùng chơi nào.", "Cảm xúc", "😒"],
  ["Excited", "/ɪkˈsaɪ.t̬ɪd/", "adj", "Hào hứng", "I am excited for the trip.", "Tớ rất hào hứng với chuyến đi.", "Cảm xúc", "🤩"],
  ["Hungry", "/ˈhʌŋ.ɡri/", "adj", "Đói bụng", "I am hungry, I want food.", "Tớ đói quá, tớ muốn ăn.", "Cảm xúc", "🤤"],
  ["Thirsty", "/ˈθɝː.sti/", "adj", "Khát nước", "I am thirsty, I need water.", "Tớ khát quá, tớ cần nước.", "Cảm xúc", "🥵"],

  // --- CHỦ ĐỀ: THỜI TIẾT VÀ TỰ NHIÊN (Weather & Nature Extensions) ---
  ["Ice", "/aɪs/", "noun", "Cục đá", "Ice is very cold.", "Đá rất lạnh.", "Tự nhiên", "🧊"],
  ["Fire", "/faɪr/", "noun", "Ngọn lửa", "Fire is dangerously hot.", "Lửa nóng rất nguy hiểm.", "Tự nhiên", "🔥"],
  ["Earth", "/ɝːθ/", "noun", "Trái đất", "We live on Earth.", "Chúng ta sống trên Trái đất.", "Tự nhiên", "🌍"],
  ["Sand", "/sænd/", "noun", "Cát", "I play with sand at the beach.", "Tớ nghịch cát ở bãi biển.", "Tự nhiên", "🏖️"],
  ["Wave", "/weɪv/", "noun", "Con sóng", "The wave is very big.", "Con sóng rất lớn.", "Tự nhiên", "🌊"],
  ["Cave", "/keɪv/", "noun", "Hang động", "Bears sleep in a cave.", "Gấu ngủ trong hang.", "Tự nhiên", "🦇"],
  ["Mud", "/mʌd/", "noun", "Bùn lầy", "Pigs like playing in mud.", "Lợn thích nghịch bùn.", "Tự nhiên", "💩"],
  ["Dust", "/dʌst/", "noun", "Bụi bẩn", "The old book has dust.", "Cuốn sách cũ bám đầy bụi.", "Tự nhiên", "💨"],
  ["Fog", "/fɑːɡ/", "noun", "Sương mù", "I can't see because of the fog.", "Tớ không thấy gì vì sương mù.", "Tự nhiên", "🌁"],
  ["Thunder", "/ˈθʌn.dɚ/", "noun", "Sấm sét", "Thunder is very loud.", "Tiếng sấm rất to.", "Tự nhiên", "⚡"],

  // --- CHỦ ĐỀ: ĐỘNG TÁC (Actions - Part 2) ---
  ["Throw", "/θroʊ/", "verb", "Ném", "Throw the ball to me.", "Hãy ném quả bóng cho tớ.", "Động tác", "🤾"],
  ["Catch", "/kætʃ/", "verb", "Bắt lấy", "I catch the ball.", "Tớ bắt lấy quả bóng.", "Động tác", "👐"],
  ["Kick", "/kɪk/", "verb", "Đá", "Kick the football hard.", "Hãy đá quả bóng thật mạnh.", "Động tác", "🦵"],
  ["Push", "/pʊʃ/", "verb", "Đẩy", "Push the heavy box.", "Hãy đẩy cái hộp nặng kìa.", "Động tác", "🫸"],
  ["Pull", "/pʊl/", "verb", "Kéo", "Pull the door directly.", "Hãy kéo cửa về phía bạn.", "Động tác", "🫷"],
  ["Climb", "/klaɪm/", "verb", "Leo trèo", "Monkeys climb trees.", "Khỉ trèo cây.", "Động tác", "🧗‍♂️"],
  ["Hide", "/haɪd/", "verb", "Trốn", "Let's play hide and seek.", "Cùng chơi trốn tìm nào.", "Động tác", "🫣"],
  ["Find", "/faɪnd/", "verb", "Tìm kiếm", "I find my lost toy.", "Tớ đã tìm thấy đồ chơi bị mất.", "Động tác", "🕵️"],
  ["Wash", "/wɑːʃ/", "verb", "Rửa, giặt", "Wash your face.", "Hãy rửa mặt đi.", "Động tác", "🧼"],
  ["Brush", "/brʌʃ/", "verb", "Chải", "Brush your hair gently.", "Hãy chải tóc nhẹ nhàng.", "Động tác", "🪮"],

  // --- CHỦ ĐỀ: CÔNG NGHỆ (Technology) ---
  ["Phone", "/foʊn/", "noun", "Điện thoại", "My mom has a new phone.", "Mẹ tớ có điện thoại mới.", "Công nghệ", "📱"],
  ["Laptop", "/ˈlæp.tɑːp/", "noun", "Máy tính xách tay", "I play games on a laptop.", "Tớ chơi game trên máy tính xách tay.", "Công nghệ", "💻"],
  ["Mouse", "/maʊs/", "noun", "Chuột máy tính", "Click the computer mouse.", "Hãy nhấn chuột máy tính.", "Công nghệ", "🖱️"],
  ["Keyboard", "/ˈkiː.bɔːrd/", "noun", "Bàn phím", "Type on the keyboard.", "Hãy gõ trên bàn phím.", "Công nghệ", "⌨️"],
  ["Screen", "/skriːn/", "noun", "Màn hình", "The TV screen is big.", "Màn hình tivi rất to.", "Công nghệ", "🖥️"],
  ["Camera", "/ˈkæm.rə/", "noun", "Máy ảnh", "Smile for the camera.", "Hãy cười lên để chụp ảnh.", "Công nghệ", "📷"],
  ["Video", "/ˈvɪd.i.oʊ/", "noun", "Video", "We watch a funny video.", "Chúng tớ xem một đoạn video vui nhộn.", "Công nghệ", "🎬"],
  ["Music", "/ˈmjuː.zɪk/", "noun", "Âm nhạc", "I like listening to music.", "Tớ thích nghe nhạc.", "Công nghệ", "🎵"],
  ["Game", "/ɡeɪm/", "noun", "Trò chơi", "Let's play a video game.", "Cùng chơi trò chơi điện tử nào.", "Công nghệ", "🎮"],
  ["Battery", "/ˈbæt̬.ɚ.i/", "noun", "Pin", "My phone needs a battery charge.", "Điện thoại tớ cần sạc pin.", "Công nghệ", "🔋"],

  // --- CHỦ ĐỀ: DỤNG CỤ NHÀ BẾP (Kitchen) ---
  ["Plate", "/pleɪt/", "noun", "Cái Đĩa", "Put the food on the plate.", "Hãy đặt thức ăn lên đĩa.", "Nhà bếp", "🍽️"],
  ["Bowl", "/boʊl/", "noun", "Cái Bát", "I eat soup in a bowl.", "Tớ ăn súp trong bát.", "Nhà bếp", "🥣"],
  ["Spoon", "/spuːn/", "noun", "Cái Thìa", "Use a spoon for soup.", "Hãy dùng thìa để ăn súp.", "Nhà bếp", "🥄"],
  ["Fork", "/fɔːrk/", "noun", "Cái Dĩa", "Eat the salad with a fork.", "Hãy ăn rau trộn bằng dĩa.", "Nhà bếp", "🍴"],
  ["Knife", "/naɪf/", "noun", "Con Dao", "Be careful with the knife.", "Hãy cẩn thận với con dao.", "Nhà bếp", "🔪"],
  ["Cup", "/kʌp/", "noun", "Cái Cốc", "A cup of tea, please.", "Cho tôi một cốc trà.", "Nhà bếp", "🍵"],
  ["Glass", "/ɡlæs/", "noun", "Cái Ly thủy tinh", "Drink a glass of water.", "Hãy uống một ly nước.", "Nhà bếp", "🥛"],
  ["Pan", "/pæn/", "noun", "Cái Chảo", "Fry the egg in a pan.", "Hãy chiên trứng trong chảo.", "Nhà bếp", "🍳"],
  ["Pot", "/pɑːt/", "noun", "Cái Nồi", "Boil water in the pot.", "Đun sôi nước trong nồi.", "Nhà bếp", "🍲"],
  ["Oven", "/ˈʌv.ən/", "noun", "Lò nướng", "Bake the cake in the oven.", "Nướng bánh trong lò.", "Nhà bếp", "🎛️"],

  // --- CHỦ ĐỀ: NHỮNG ĐỒ VẬT KHÁC (Other objects) ---
  ["Bag", "/bæɡ/", "noun", "Cái túi", "My bag is heavy.", "Túi của tớ rất nặng.", "Đồ vật", "🛍️"],
  ["Box", "/bɑːks/", "noun", "Cái hộp", "What is inside the box?", "Có gì bên trong cái hộp?", "Đồ vật", "📦"],
  ["Clock", "/klɑːk/", "noun", "Đồng hồ treo tường", "The clock ticks all day.", "Đồng hồ tích tắc cả ngày.", "Đồ vật", "🕰️"],
  ["Watch", "/wɑːtʃ/", "noun", "Đồng hồ đeo tay", "My dad wears a watch.", "Bố tớ đeo một chiếc đồng hồ.", "Đồ vật", "⌚"],
  ["Umbrella", "/ʌmˈbrel.ə/", "noun", "Cái ô (dù)", "Take an umbrella, it's raining.", "Mang theo ô kìa, trời đang mưa.", "Đồ vật", "☂️"],
  ["Money", "/ˈmʌn.i/", "noun", "Tiền", "I save my money.", "Tớ tiết kiệm tiền.", "Đồ vật", "💵"],
  ["Ticket", "/ˈtɪk.ɪt/", "noun", "Vé", "Show your movie ticket.", "Hãy đưa vé xem phim ra.", "Đồ vật", "🎫"],
  ["Brush", "/brʌʃ/", "noun", "Bàn chải", "Use a toothbrush to clean teeth.", "Dùng bàn chải để đánh răng.", "Đồ vật", "🪥"],
  ["Soap", "/soʊp/", "noun", "Xà phòng", "Wash hands with soap.", "Rửa tay bằng xà phòng.", "Đồ vật", "🧼"],
  ["Towel", "/taʊəl/", "noun", "Cái khăn", "Dry your face with a towel.", "Lau mặt bằng khăn.", "Đồ vật", "🧖"],

  // --- CHỦ ĐỀ: ĐỒ UỐNG VÀ ĂN VẶT (Drinks & Snacks) ---
  ["Juice", "/dʒuːs/", "noun", "Nước ép", "I drink apple juice.", "Tớ uống nước ép táo.", "Đồ uống", "🧃"],
  ["Tea", "/tiː/", "noun", "Trà", "My grandma drinks tea.", "Bà tớ uống trà.", "Đồ uống", "🍵"],
  ["Coffee", "/ˈkɑː.fi/", "noun", "Cà phê", "Dad drinks coffee every morning.", "Bố uống cà phê mỗi sáng.", "Đồ uống", "☕"],
  ["Soda", "/ˈsoʊ.də/", "noun", "Nước ngọt có gas", "Don't drink too much soda.", "Đừng uống quá nhiều nước ngọt.", "Đồ uống", "🥤"],
  ["Soup", "/suːp/", "noun", "Món súp", "This chicken soup is hot.", "Món súp gà này rất nóng.", "Đồ ăn vặt", "🍲"],
  ["Chips", "/tʃɪps/", "noun", "Khoai tây chiên", "I like to eat potato chips.", "Tớ thích ăn khoai tây chiên mỏng.", "Đồ ăn vặt", "🍟"],
  ["Popcorn", "/ˈpɑːp.kɔːrn/", "noun", "Bắp rang bơ", "We eat popcorn at the cinema.", "Chúng tớ ăn bắp rang bơ ở rạp chiếu phim.", "Đồ ăn vặt", "🍿"],
  ["Chocolate", "/ˈtʃɑːk.lət/", "noun", " Sô-cô-la", "I love dark chocolate.", "Tớ thích sô-cô-la đen.", "Đồ ăn vặt", "🍫"],
  ["Sandwich", "/ˈsænd.wɪtʃ/", "noun", "Bánh mì kẹp", "I have a sandwich for lunch.", "Tớ ăn bánh mì kẹp vào bữa trưa.", "Đồ ăn vặt", "🥪"],
  ["Noodles", "/ˈnuː.dəlz/", "noun", "Mì sợi", "I eat noodles with chopsticks.", "Tớ ăn mì bằng đũa.", "Đồ ăn vặt", "🍜"],

  // --- CHỦ ĐỀ: LỄ HỘI VÀ SỰ KIỆN (Festivals & Events) ---
  ["Party", "/ˈpɑːr.t̬i/", "noun", "Bữa tiệc", "We have a birthday party.", "Chúng tớ có một bữa tiệc sinh nhật.", "Lễ hội", "🎉"],
  ["Gift", "/ɡɪft/", "noun", "Món quà", "This gift is for you.", "Món quà này dành cho bạn.", "Lễ hội", "🎁"],
  ["Balloon", "/bəˈluːn/", "noun", "Quả bóng bay", "The balloon is red.", "Quả bóng bay màu đỏ.", "Lễ hội", "🎈"],
  ["Candle", "/ˈkæn.dəl/", "noun", "Cây nến", "Blow out the candle.", "Hãy thổi tắt nến đi.", "Lễ hội", "🕯️"],
  ["Music", "/ˈmjuː.zɪk/", "noun", "Âm nhạc", "Let's listent to music.", "Cùng nghe nhạc nào.", "Lễ hội", "🎶"],
  ["Dance", "/dæns/", "verb", "Nhảy múa", "We dance together.", "Chúng mình cùng nhảy múa.", "Lễ hội", "💃"],
  ["Halloween", "/ˌhæl.oʊˈiːn/", "noun", "Lễ hội ma quỷ", "We dress up for Halloween.", "Chúng tớ hóa trang vào dịp Halloween.", "Lễ hội", "🎃"],
  ["Christmas", "/ˈkrɪs.məs/", "noun", "Lễ Giáng sinh", "Merry Christmas!", "Chúc mừng Giáng sinh!", "Lễ hội", "🎄"],
  ["New Year", "/ˈnuː ˌjɪr/", "noun", "Năm mới", "Happy New Year!", "Chúc mừng Năm mới!", "Lễ hội", "🎆"],
  ["Holiday", "/ˈhɑː.lə.deɪ/", "noun", "Kỳ nghỉ", "We go to the beach on holiday.", "Chúng tớ đi biển vào kỳ nghỉ.", "Lễ hội", "🏖️"],

  // --- CHỦ ĐỀ: KHÔNG GIAN BÊN TRONG (Indoor Spaces) ---
  ["Bedroom", "/ˈbed.ruːm/", "noun", "Phòng ngủ", "My bedroom is clean.", "Phòng ngủ của tớ rất sạch sẽ.", "Không gian", "🛏️"],
  ["Bathroom", "/ˈbæθ.ruːm/", "noun", "Phòng tắm", "I wash my hands in the bathroom.", "Tớ rửa tay trong phòng tắm.", "Không gian", "🛁"],
  ["Kitchen", "/ˈkɪtʃ.ən/", "noun", "Nhà bếp", "Mom is cooking in the kitchen.", "Mẹ đang nấu ăn trong bếp.", "Không gian", "🍳"],
  ["Living room", "/ˈlɪv.ɪŋ ˌruːm/", "noun", "Phòng khách", "We watch TV in the living room.", "Chúng tớ xem tivi trong phòng khách.", "Không gian", "🛋️"],
  ["Garden", "/ˈɡɑːr.dən/", "noun", "Khu vườn", "There are many flowers in the garden.", "Có rất nhiều hoa trong vườn.", "Không gian", "🏡"],
  ["Garage", "/ɡəˈrɑːʒ/", "noun", "Ki-ốt/Nhà để xe", "Dad puts the car in the garage.", "Bố đỗ chiếc xe trong nhà để xe.", "Không gian", "🚗"],
  ["Balcony", "/ˈbæl.kə.ni/", "noun", "Ban công", "I stand on the balcony.", "Tớ đứng ở ngoài ban công.", "Không gian", "🏢"],
  ["Stairs", "/sterz/", "noun", "Cầu thang", "Be careful on the stairs.", "Cẩn thận khi đi cầu thang nhé.", "Không gian", "🪜"],
  ["Wall", "/wɑːl/", "noun", "Bức tường", "The wall is white.", "Bức tường màu trắng.", "Không gian", "🧱"],
  ["Floor", "/flɔːr/", "noun", "Sàn nhà", "Sweep the floor.", "Hãy quét sàn nhà đi.", "Không gian", "🧹"],

  // --- CHỦ ĐỀ: NHẠC CỤ (Musical Instruments) ---
  ["Piano", "/piˈæn.oʊ/", "noun", "Đàn piano", "She plays the piano well.", "Cô ấy chơi piano rất giỏi.", "Nhạc cụ", "🎹"],
  ["Guitar", "/ɡɪˈtɑːr/", "noun", "Đàn ghi-ta", "He learns to play guitar.", "Cậu ấy học chơi ghi-ta.", "Nhạc cụ", "🎸"],
  ["Drum", "/drʌm/", "noun", "Cái trống", "The drum is very loud.", "Tiếng trống rất to.", "Nhạc cụ", "🥁"],
  ["Violin", "/ˌvaɪəˈlɪn/", "noun", "Đàn vi-ô-lông", "The violin sounds beautiful.", "Tiếng đàn vi-ô-lông nghe tuyệt hay.", "Nhạc cụ", "🎻"],
  ["Flute", "/fluːt/", "noun", "Cây sáo", "I can blow the flute.", "Tớ có thể thổi sáo.", "Nhạc cụ", "🎵"],
  ["Trumpet", "/ˈtrʌm.pət/", "noun", "Kèn trumpet", "The trumpet makes a high sound.", "Kèn trumpet tạo ra âm thanh cao.", "Nhạc cụ", "🎺"],
  ["Saxophone", "/ˈsæk.sə.foʊn/", "noun", "Kèn saxophone", "Jazz music uses saxophone.", "Nhạc Jazz hay dùng kèn saxophone.", "Nhạc cụ", "🎷"],
  ["Microphone", "/ˈmaɪ.krə.foʊn/", "noun", "Cái mi-crô", "Sing into the microphone.", "Hãy hát vào mi-crô.", "Nhạc cụ", "🎤"],
  ["Bell", "/bel/", "noun", "Cái chuông", "Ring the bell.", "Hãy rung chuông lên.", "Nhạc cụ", "🔔"],
  ["Whistle", "/ˈhwɪs.əl/", "noun", "Cái còi", "The referee blows the whistle.", "Trọng tài thổi còi.", "Nhạc cụ", "😙"],

  // --- CHỦ ĐỀ: CÂY CỐI VÀ THIÊN NHIÊN (Plants & Nature 2) ---
  ["Seed", "/siːd/", "noun", "Hạt giống", "Plant a seed in the ground.", "Hãy gieo một hạt giống xuống đất.", "Thực vật", "🌱"],
  ["Root", "/ruːt/", "noun", "Rễ cây", "Roots grow under the dirt.", "Rễ cây mọc dưới lòng đất.", "Thực vật", "🫚"],
  ["Trunk", "/trʌŋk/", "noun", "Thân cây", "The tree trunk is thick.", "Thân cây rất dày.", "Thực vật", "🪵"],
  ["Branch", "/bræntʃ/", "noun", "Cành cây", "A bird sits on the branch.", "Một con chim đậu trên cành cây.", "Thực vật", "🌿"],
  ["Rose", "/roʊz/", "noun", "Hoa hồng", "The rose is red.", "Hoa hồng màu đỏ.", "Thực vật", "🌹"],
  ["Sunflower", "/ˈsʌnˌflaʊ.ɚ/", "noun", "Hoa hướng dương", "The sunflower is yellow.", "Hoa hướng dương màu vàng.", "Thực vật", "🌻"],
  ["Grass", "/ɡræs/", "noun", "Cỏ", "Cows eat grass.", "Bò ăn cỏ.", "Thực vật", "🌱"],
  ["Soil", "/sɔɪl/", "noun", "Đất trồng", "Put the flower in the soil.", "Hãy đặt bông hoa vào đất.", "Thực vật", "🪴"],
  ["Wood", "/wʊd/", "noun", "Gỗ", "Tables are made of wood.", "Bàn được làm bằng gỗ.", "Thực vật", "🪵"],
  ["Jungle", "/ˈdʒʌŋ.ɡəl/", "noun", "Rừng nhiệt đới", "Lions live in the jungle.", "Sư tử sống trong khu rừng nhiệt đới.", "Thực vật", "🌴"],

  // --- CHỦ ĐỀ: THÚ CƯNG (Pets) ---
  ["Puppy", "/ˈpʌp.i/", "noun", "Chó con", "The puppy is cute.", "Chú chó con rất dễ thương.", "Thú cưng", "🐕"],
  ["Kitten", "/ˈkɪt.ən/", "noun", "Mèo con", "The kitten sleeps on the bed.", "Chú mèo con ngủ trên giường.", "Thú cưng", "🐈"],
  ["Goldfish", "/ˈɡoʊld.fɪʃ/", "noun", "Cá vàng", "The goldfish swims in the bowl.", "Cá vàng bơi trong chậu.", "Thú cưng", "🐠"],
  ["Hamster", "/ˈhæm.stɚ/", "noun", "Chuột hamster", "The hamster runs in a wheel.", "Con chuột hamster chạy trong vòng quay.", "Thú cưng", "🐹"],
  ["Parrot", "/ˈper.ət/", "noun", "Con vẹt", "The parrot can talk.", "Con vẹt có thể nói chuyện.", "Thú cưng", "🦜"],
  ["Turtle", "/ˈtɝː.t̬əl/", "noun", "Con rùa", "The turtle walks slowly.", "Con rùa bò chầm chậm.", "Thú cưng", "🐢"],
  ["Lizard", "/ˈlɪz.ɚd/", "noun", "Thằn lằn", "A lizard is on the wall.", "Một con thằn lằn trên tường.", "Thú cưng", "🦎"],
  ["Guinea pig", "/ˈɡɪn.i ˌpɪɡ/", "noun", "Chuột lang", "The guinea pig eats carrots.", "Chuột lang ăn cà rốt.", "Thú cưng", "🐁"],
  ["Rabbit", "/ˈræb.ɪt/", "noun", "Thỏ", "My rabbit is white.", "Thỏ của tớ màu trắng.", "Thú cưng", "🐇"],
  ["Frog", "/frɑːɡ/", "noun", "Con ếch", "The frog jumps high.", "Con ếch nhảy rất cao.", "Thú cưng", "🐸"],

  // --- CHỦ ĐỀ: HẢI SẢN & ĐỘNG VẬT BIỂN (Marine Animals) ---
  ["Whale", "/weɪl/", "noun", "Cá voi", "The whale is the biggest animal.", "Cá voi là động vật lớn nhất.", "Động vật", "🐳"],
  ["Shark", "/ʃɑːrk/", "noun", "Cá mập", "Sharks have sharp teeth.", "Cá mập có hàm răng sắc nhọn.", "Động vật", "🦈"],
  ["Octopus", "/ˈɑːk.tə.pəs/", "noun", "Bạch tuộc", "The octopus has eight arms.", "Bạch tuộc có tám xúc tu.", "Động vật", "🐙"],
  ["Crab", "/kræb/", "noun", "Con cua", "The crab walks sideways.", "Con cua bò ngang.", "Động vật", "🦀"],
  ["Starfish", "/ˈstɑːr.fɪʃ/", "noun", "Sao biển", "I found a starfish on the beach.", "Tớ tìm thấy một con sao biển trên bãi.", "Động vật", "⭐"],
  ["Jellyfish", "/ˈdʒel.i.fɪʃ/", "noun", "Con sứa", "Don't touch the jellyfish.", "Đừng chạm vào con sứa.", "Động vật", "🪼"],
  ["Seahorse", "/ˈsiː.hɔːrs/", "noun", "Cá ngựa", "The seahorse is small.", "Cá ngựa thì nhỏ xíu.", "Động vật", "🌊"],
  ["Shrimp", "/ʃrɪmp/", "noun", "Con tôm", "Shrimp is delicious.", "Tôm ăn rất ngon.", "Động vật", "🦐"],
  ["Squid", "/skwɪd/", "noun", "Con mực", "The squid shoots ink.", "Con mực phun mực đen.", "Động vật", "🦑"],
  ["Seal", "/siːl/", "noun", "Hải cẩu", "The seal claps its hands.", "Hải cẩu vỗ tay.", "Động vật", "🦭"],

  // --- CHỦ ĐỀ: CÔN TRÙNG (Insects) ---
  ["Bee", "/biː/", "noun", "Con ong", "The bee makes honey.", "Con ong làm ra mật.", "Côn trùng", "🐝"],
  ["Butterfly", "/ˈbʌt̬.ɚ.flaɪ/", "noun", "Con bướm", "The butterfly is beautiful.", "Con bướm thật đẹp.", "Côn trùng", "🦋"],
  ["Ant", "/ænt/", "noun", "Con kiến", "Ants work together.", "Loài kiến làm việc cùng nhau.", "Côn trùng", "🐜"],
  ["Spider", "/ˈspaɪ.dɚ/", "noun", "Con nhện", "The spider makes a web.", "Con nhện giăng tơ.", "Côn trùng", "🕷️"],
  ["Ladybug", "/ˈleɪ.di.bʌɡ/", "noun", "Bọ rùa", "The ladybug is red with black spots.", "Bọ rùa có màu đỏ với đốm đen.", "Côn trùng", "🐞"],
  ["Mosquito", "/məˈskiː.t̬oʊ/", "noun", "Con muỗi", "The mosquito bites me.", "Con muỗi đốt tớ.", "Côn trùng", "🦟"],
  ["Fly", "/flaɪ/", "noun", "Con ruồi", "The fly is annoying.", "Con ruồi thật phiền phức.", "Côn trùng", "🪰"],
  ["Worm", "/wɝːm/", "noun", "Con giun", "The worm lives in the dirt.", "Con giun sống dưới đất.", "Côn trùng", "🪱"],
  ["Grasshopper", "/ˈɡræsˌhɑː.pɚ/", "noun", "Châu chấu", "The grasshopper jumps around.", "Con châu chấu nhảy lung tung.", "Côn trùng", "🦗"],
  ["Caterpillar", "/ˈkæt̬.ɚ.pɪl.ɚ/", "noun", "Sâu bướm", "The caterpillar eats leaves.", "Sâu bướm ăn lá cây.", "Côn trùng", "🐛"],

  // --- CHỦ ĐỀ: NGHỀ NGHIỆP VÀ CÔNG VIỆC (Jobs 2) ---
  ["Dentist", "/ˈden.t̬ɪst/", "noun", "Nha sĩ", "The dentist checks my teeth.", "Nha sĩ kiểm tra răng của tớ.", "Nghề nghiệp", "🧑‍⚕️"],
  ["Vet", "/vet/", "noun", "Bác sĩ thú y", "The vet helps sick animals.", "Bác sĩ thú y chữa bệnh cho động vật.", "Nghề nghiệp", "🩺"],
  ["Builder", "/ˈbɪl.dɚ/", "noun", "Thợ xây", "The builder builds a house.", "Người thợ xây cất ngôi nhà.", "Nghề nghiệp", "👷"],
  ["Mechanic", "/məˈkæn.ɪk/", "noun", "Thợ sửa xe", "The mechanic fixes cars.", "Thợ sửa xe sửa chữa ô tô.", "Nghề nghiệp", "🔧"],
  ["Artist", "/ˈɑːr.t̬ɪst/", "noun", "Họa sĩ", "The artist paints a picture.", "Họa sĩ vẽ một bức tranh.", "Nghề nghiệp", "👨‍🎨"],
  ["Baker", "/ˈbeɪ.kɚ/", "noun", "Thợ làm bánh", "The baker makes bread.", "Thợ làm bánh làm ra bánh mì.", "Nghề nghiệp", "🥖"],
  ["Scientist", "/ˈsaɪən.tɪst/", "noun", "Nhà khoa học", "The scientist does experiments.", "Nhà khoa học làm các thí nghiệm.", "Nghề nghiệp", "🧑‍🔬"],
  ["Astronaut", "/ˈæs.trə.nɑːt/", "noun", "Phi hành gia", "The astronaut goes to space.", "Phi hành gia bay vào vũ trụ.", "Nghề nghiệp", "👩‍🚀"],
  ["Barber", "/ˈbɑːr.bɚ/", "noun", "Thợ cắt tóc", "The barber cuts my hair.", "Thợ cắt tóc cắt tóc cho tớ.", "Nghề nghiệp", "💈"],
  ["Postman", "/ˈpoʊst.mən/", "noun", "Người đưa thư", "The postman brings letters.", "Ngài đưa thư mang những bức thư đến.", "Nghề nghiệp", "📬"],

  // --- CHỦ ĐỀ: CÁC MÔN HỌC (School Subjects) ---
  ["Math", "/mæθ/", "noun", "Môn Toán", "I am good at math.", "Tớ học giỏi toán.", "Trường học", "🔢"],
  ["Science", "/ˈsaɪ.əns/", "noun", "Môn Khoa học", "Science is interesting.", "Khoa học rất thú vị.", "Trường học", "🔬"],
  ["History", "/ˈhɪs.t̬ɚ.i/", "noun", "Môn Lịch sử", "We learn history at school.", "Chúng tớ học lịch sử ở trường.", "Trường học", "📜"],
  ["Geography", "/dʒiˈɑː.ɡrə.fi/", "noun", "Môn Địa lý", "Geography teaches us about maps.", "Địa lý dạy cho chúng ta về bản đồ.", "Trường học", "🌍"],
  ["Art", "/ɑːrt/", "noun", "Môn Mỹ thuật", "I draw pictures in art class.", "Tớ vẽ tranh trong giờ mỹ thuật.", "Trường học", "🎨"],
  ["Music", "/ˈmjuː.zɪk/", "noun", "Môn Âm nhạc", "We sing in music class.", "Chúng tớ hát trong giờ âm nhạc.", "Trường học", "🎼"],
  ["English", "/ˈɪŋ.ɡlɪʃ/", "noun", "Môn Tiếng Anh", "I study English every day.", "Tớ học tiếng Anh mỗi ngày.", "Trường học", "🇬🇧"],
  ["P.E.", "/ˌpiːˈiː/", "noun", "Môn Thể dục", "P.E. makes me strong.", "Môn thể dục giúp tớ khỏe mạnh.", "Trường học", "🏃"],
  ["Computer", "/kəmˈpjuː.t̬ɚ/", "noun", "Tin học", "We learn to type in computer class.", "Chúng tớ học gõ máy trong giờ tin học.", "Trường học", "💻"],
  ["Literature", "/ˈlɪt̬.ɚ.ə.tʃɚ/", "noun", "Môn Ngữ Văn", "We read stories in literature.", "Chúng tớ đọc truyện trong giờ ngữ văn.", "Trường học", "📚"],

  // --- CHỦ ĐỀ: THỜI TRANG VÀ TRANG SỨC (Fashion & Jewelry) ---
  ["Ring", "/rɪŋ/", "noun", "Chiếc nhẫn", "She wears a gold ring.", "Cô ấy đeo một chiếc nhẫn vàng.", "Trang sức", "💍"],
  ["Necklace", "/ˈnek.ləs/", "noun", "Dây chuyền", "The necklace is shiny.", "Sợi dây chuyền thật lấp lánh.", "Trang sức", "📿"],
  ["Earring", "/ˈɪr.ɪŋ/", "noun", "Khuyên tai", "She lost an earring.", "Cô ấy làm mất một chiếc khuyên tai.", "Trang sức", "👂"],
  ["Bracelet", "/ˈbreɪ.slət/", "noun", "Vòng tay", "I bought a silver bracelet.", "Tớ đã mua một chiếc vòng tay bạc.", "Trang sức", "💎"],
  ["Belt", "/belt/", "noun", "Thắt lưng", "He wears a black belt.", "Anh ấy thắt một chiếc thắt lưng đen.", "Trang sức", "🥋"],
  ["Watch", "/wɑːtʃ/", "noun", "Đồng hồ (tay)", "What time is it on your watch?", "Đồng hồ của bạn mấy giờ rồi?", "Trang sức", "⌚"],
  ["Glove", "/ɡlʌv/", "noun", "Găng tay", "Wear gloves when it is cold.", "Hãy mang găng tay khi trời lạnh.", "Trang phục", "🧤"],
  ["Tie", "/taɪ/", "noun", "Cà vạt", "Dad wears a tie to work.", "Bố thắt cà vạt đi làm.", "Trang phục", "👔"],
  ["Sunglasses", "/ˈsʌnˌɡlæs.ɪz/", "noun", "Kính râm", "The sun is bright, I need sunglasses.", "Trời nắng chói, tôi cần kính râm.", "Trang phục", "🕶️"],
  ["Crown", "/kraʊn/", "noun", "Vương miện", "The queen wears a crown.", "Nữ hoàng đội chiếc vương miện.", "Trang sức", "👑"],

  // --- CHỦ ĐỀ: KHÔNG GIAN VÀ VŨ TRỤ (Space & Universe) ---
  ["Space", "/speɪs/", "noun", "Không gian", "Space is very big and dark.", "Không gian rất rộng lớn và tối tăm.", "Vũ trụ", "🌌"],
  ["Earth", "/ɝːθ/", "noun", "Trái Đất", "Our planet is Earth.", "Hành tinh của chúng ta là Trái Đất.", "Vũ trụ", "🌍"],
  ["Moon", "/muːn/", "noun", "Mặt Trăng", "The Moon shines at night.", "Mặt Trăng tỏa sáng vào ban đêm.", "Vũ trụ", "🌕"],
  ["Sun", "/sʌn/", "noun", "Mặt Trời", "The Sun gives us heat.", "Mặt Trời mang lại hơi ấm cho chúng ta.", "Vũ trụ", "🌞"],
  ["Star", "/stɑːr/", "noun", "Ngôi sao", "I see many stars.", "Tớ thấy rất nhiều ngôi sao.", "Vũ trụ", "✨"],
  ["Planet", "/ˈplæn.ɪt/", "noun", "Hành tinh", "Mars is a red planet.", "Sao Hỏa là một hành tinh đỏ.", "Vũ trụ", "🪐"],
  ["Rocket", "/ˈrɑː.kɪt/", "noun", "Tên lửa", "The rocket flies to space.", "Tên lửa bay vào vũ trụ.", "Vũ trụ", "🚀"],
  ["Astronaut", "/ˈæs.trə.nɑːt/", "noun", "Phi hành gia", "An astronaut walks on the moon.", "Một phi hành gia đi bộ trên mặt trăng.", "Vũ trụ", "👨‍🚀"],
  ["Alien", "/ˈeɪ.li.ən/", "noun", "Người ngoài hành tinh", "Is the alien real?", "Người ngoài hành tinh có thật không?", "Vũ trụ", "👽"],
  ["UFO", "/ˌjuː.efˈoʊ/", "noun", "Đĩa bay", "A UFO is a flying saucer.", "UFO là một chiếc đĩa bay.", "Vũ trụ", "🛸"],

  // --- CHỦ ĐỀ: TÍNH TỪ VỀ KÍCH THƯỚC (Size Adjectives) ---
  ["Big", "/bɪɡ/", "adj", "To lớn", "The elephant is big.", "Con voi thì to lớn.", "Tính từ", "🐘"],
  ["Small", "/smɑːl/", "adj", "Nhỏ bé", "The mouse is small.", "Con chuột thì nhỏ xíu.", "Tính từ", "🐭"],
  ["Tall", "/tɑːl/", "adj", "Cao", "That tree is very tall.", "Cái cây kia rất cao.", "Tính từ", "🌳"],
  ["Short", "/ʃɔːrt/", "adj", "Ngắn, lùn", "The boy is short.", "Cậu bé hơi lùn.", "Tính từ", "🚶"],
  ["Long", "/lɑːŋ/", "adj", "Dài", "The snake is long.", "Con rắn thì dài.", "Tính từ", "🐍"],
  ["Thick", "/θɪk/", "adj", "Dày", "This book is thick.", "Cuốn sách này rất dày.", "Tính từ", "📕"],
  ["Thin", "/θɪn/", "adj", "Mỏng, gầy", "He is thin.", "Anh ấy gầy.", "Tính từ", "🧍"],
  ["Heavy", "/ˈhev.i/", "adj", "Nặng", "The rock is heavy.", "Tảng đá này rất nặng.", "Tính từ", "🪨"],
  ["Light", "/laɪt/", "adj", "Nhẹ", "The feather is light.", "Chiếc lông vũ rất nhẹ.", "Tính từ", "🪶"],
  ["Wide", "/waɪd/", "adj", "Rộng", "The river is wide.", "Dòng sông này rất rộng.", "Tính từ", "🌊"],

  // --- CHỦ ĐỀ: TÍNH CÁCH (Personalities & Traits) ---
  ["Kind", "/kaɪnd/", "adj", "Tốt bụng", "She is a kind girl.", "Cô ấy là một cô bé tốt bụng.", "Tính cách", "😇"],
  ["Brave", "/breɪv/", "adj", "Dũng cảm", "The hero is brave.", "Vị anh hùng rất dũng cảm.", "Tính cách", "🗡️"],
  ["Clever", "/ˈklev.ɚ/", "adj", "Thông minh", "He is clever.", "Cậu bé rất thông minh.", "Tính cách", "🧠"],
  ["Funny", "/ˈfʌn.i/", "adj", "Hài hước", "The clown is funny.", "Chú hề thật hài hước.", "Tính cách", "🤣"],
  ["Quiet", "/ˈkwaɪ.ət/", "adj", "Yên lặng/trầm tính", "The library is quiet.", "Thư viện rất yên tĩnh.", "Tính cách", "🤫"],
  ["Noisy", "/ˈnɔɪ.zi/", "adj", "Ồn ào", "The street is noisy.", "Con phố rất ồn ào.", "Tính cách", "🔊"],
  ["Lazy", "/ˈleɪ.zi/", "adj", "Lười biếng", "Don't be lazy.", "Đừng lười biếng nhé.", "Tính cách", "🥱"],
  ["Polite", "/pəˈlaɪt/", "adj", "Lịch sự", "Always be polite.", "Hãy luôn giữ lịch sự nhẹ.", "Tính cách", "🎩"],
  ["Strong", "/strɑːŋ/", "adj", "Khỏe mạnh", "He is very strong.", "Anh ấy rất khỏe mạnh.", "Tính cách", "💪"],
  ["Cute", "/kjuːt/", "adj", "Dễ thương", "The baby is cute.", "Em bé thật dễ thương.", "Tính cách", "🥰"],

  // --- CHỦ ĐỀ: ĐỘNG TỪ BẾP NÚC (Cooking Actions) ---
  ["Cook", "/kʊk/", "verb", "Nấu ăn", "I can cook eggs.", "Tớ biết nấu trứng.", "Hành động", "🍳"],
  ["Bake", "/beɪk/", "verb", "Nướng bánh", "Mom bakes a cake.", "Mẹ nướng bánh kem.", "Hành động", "🧁"],
  ["Boil", "/bɔɪl/", "verb", "Luộc, đun sôi", "Boil the water first.", "Hãy đun sôi nước trước.", "Hành động", "🥘"],
  ["Fry", "/fraɪ/", "verb", "Chiên, rán", "We fry the fish.", "Chúng tớ rán cá.", "Hành động", "🍤"],
  ["Cut", "/kʌt/", "verb", "Cắt tháic", "Cut the apple.", "Hãy cắt quả táo đi.", "Hành động", "🔪"],
  ["Mix", "/mɪks/", "verb", "Trộn lẫn", "Mix everything together.", "Trộn mọi thứ lại với nhau.", "Hành động", "🥣"],
  ["Pour", "/pɔːr/", "verb", "Rót, đổ", "Pour the milk.", "Rót sữa vào nhé.", "Hành động", "🥛"],
  ["Wash", "/wɑːʃ/", "verb", "Rửa dọn", "Wash the dishes.", "Hãy rửa bát đĩa.", "Hành động", "🍽️"],
  ["Eat", "/iːt/", "verb", "Ăn", "Let's eat dinner.", "Cùng ăn tối nào.", "Hành động", "🤤"],
  ["Drink", "/drɪŋk/", "verb", "Uống", "Always drink enough water.", "Luôn nhớ uống đủ nước.", "Hành động", "🥤"],

  // --- CHỦ ĐỀ: BỆNH TẬT CƠ BẢN (Basic Sickness) ---
  ["Sick", "/sɪk/", "adj", "Bị ốm", "I stay in bed when I am sick.", "Tớ nằm trên giường khi bị ốm.", "Sức khỏe", "🤒"],
  ["Cough", "/kɑːf/", "noun", "Cơn ho", "He has a bad cough.", "Anh ấy bị ho nặng.", "Sức khỏe", "🤧"],
  ["Fever", "/ˈfiː.vɚ/", "noun", "Cơn sốt", "My head is hot, I have a fever.", "Đầu tớ nóng, tớ bị sốt rồi.", "Sức khỏe", "🤒"],
  ["Headache", "/ˈhed.eɪk/", "noun", "Đau đầu", "I have a headache.", "Tớ đang bị đau đầu.", "Sức khỏe", "🤕"],
  ["Toothache", "/ˈtuːθ.eɪk/", "noun", "Đau răng", "Eating too much candy causes a toothache.", "Ăn quá nhiều kẹo sẽ gây đau răng.", "Sức khỏe", "😫"],
  ["Medicine", "/ˈmed.ɪ.sən/", "noun", "Thuốc", "Take your medicine gracefully.", "Hãy ngoan ngoãn uống thuốc.", "Sức khỏe", "💊"],
  ["Bandage", "/ˈbæn.dɪdʒ/", "noun", "Băng cá nhân", "Put a bandage on the cut.", "Hãy dán băng cá nhân vào vết cắt.", "Sức khỏe", "🩹"],
  ["Clinic", "/ˈklɪn.ɪk/", "noun", "Phòng khám", "Go to the clinic.", "Hãy đến phòng khám.", "Sức khỏe", "🏥"],
  ["Sneeze", "/sniːz/", "verb", "Hắt hơi", "Cover your mouth when you sneeze.", "Hãy che miệng khi hắt hơi.", "Sức khỏe", "🤧"],
  ["Healthy", "/ˈhel.θi/", "adj", "Khỏe mạnh", "Eat vegetables to be healthy.", "Hãy ăn rau để khỏe mạnh.", "Sức khỏe", "💪"],

  // --- CHỦ ĐỀ: THỂ THAO VÀ HOẠT ĐỘNG (Sports & Activities 2) ---
  ["Jump rope", "/dʒʌmp roʊp/", "verb", "Nhảy dây", "I jump rope with friends.", "Tớ nhảy dây cùng bạn bè.", "Hoạt động", "🪢"],
  ["Skate", "/skeɪt/", "verb", "Trượt băng/trượt patin", "She skates in the park.", "Cô ấy trượt patin trong công viên.", "Hoạt động", "⛸️"],
  ["Skiing", "/ˈskiː.ɪŋ/", "noun", "Môn trượt tuyết", "Skiing is a winter sport.", "Trượt tuyết là môn thể thao mùa đông.", "Thể thao", "🎿"],
  ["Gymnastics", "/dʒɪmˈnæs.tɪks/", "noun", "Thể dục dụng cụ", "Gymnastics makes you flexible.", "Thể dục dụng cụ giúp bạn dẻo dai.", "Thể thao", "🤸‍♀️"],
  ["Yoga", "/ˈjoʊ.ɡə/", "noun", "Tập Yoga", "My mom practices yoga.", "Mẹ tớ tập yoga.", "Thể thao", "🧘‍♀️"],
  ["Golf", "/ɡɑːlf/", "noun", "Đánh gôn", "He plays golf on Sunday.", "Anh ấy chơi gôn vào Chủ Nhật.", "Thể thao", "⛳"],
  ["Ping pong", "/ˈpɪŋ ˌpɑːŋ/", "noun", "Bóng bàn", "We play ping pong indoors.", "Chúng tớ chơi bóng bàn trong nhà.", "Thể thao", "🏓"],
  ["Boxing", "/ˈbɑːk.sɪŋ/", "noun", "Môn quyền anh", "He learns boxing.", "Cậu ấy học quyền anh.", "Thể thao", "🥊"],
  ["Surfing", "/ˈsɝː.fɪŋ/", "noun", "Lướt sóng", "Surfing is fun on the waves.", "Lướt sóng rất vui trên những ngọn sóng.", "Thể thao", "🏄‍♂️"],
  ["Climbing", "/ˈklaɪ.mɪŋ/", "noun", "Môn leo núi", "Rock climbing is hard.", "Môn leo núi đá rất khó.", "Thể thao", "🧗‍♀️"],

  // --- CHỦ ĐỀ: ĐỒ CẮM TRẠI (Camping) ---
  ["Camp", "/kæmp/", "noun", "Cắm trại", "We set up a camp.", "Chúng tớ dựng trại.", "Cắm trại", "🏕️"],
  ["Tent", "/tent/", "noun", "Cái lều", "We sleep in a tent.", "Chúng tớ ngủ trong lều.", "Cắm trại", "⛺"],
  ["Backpack", "/ˈbæk.pæk/", "noun", "Ba-lô", "Carry your backpack.", "Hãy đeo ba-lô của bạn.", "Cắm trại", "🎒"],
  ["Compass", "/ˈkʌm.pəs/", "noun", "La bàn", "The compass shows north.", "La bàn chỉ hướng bắc.", "Cắm trại", "🧭"],
  ["Flashlight", "/ˈflæʃ.laɪt/", "noun", "Đèn pin", "Turn on the flashlight in the dark.", "Bật đèn pin trong bóng tối nhé.", "Cắm trại", "🔦"],
  ["Match", "/mætʃ/", "noun", "Que diêm", "Light the match carefully.", "Cẩn thận khi quẹt diêm.", "Cắm trại", "🔥"],
  ["Rope", "/roʊp/", "noun", "Sợi dây thừng", "Tie it with a rope.", "Hãy buộc nó lại bằng dây thừng.", "Cắm trại", "🪢"],
  ["Map", "/mæp/", "noun", "Bản đồ", "Look at the map so we don't get lost.", "Xem bản đồ để không bị lạc nhé.", "Cắm trại", "🗺️"],
  ["Binoculars", "/bəˈnɑː.kjə.lɚz/", "noun", "Ống nhòm", "Use binoculars to see far away.", "Dùng ống nhòm để nhìn xa.", "Cắm trại", "🔭"],
  ["Fire", "/faɪr/", "noun", "Đốt lửa trại", "We sit around the fire.", "Chúng mình ngồi quanh đống lửa.", "Cắm trại", "🔥"],

  // --- CHỦ ĐỀ: ĐỘNG TỪ GIAO TIẾP (Communication Verbs) ---
  ["Say", "/seɪ/", "verb", "Nói", "What did you say?", "Bạn vừa nói gì thế?", "Giao tiếp", "💬"],
  ["Tell", "/tel/", "verb", "Kể, bảo", "Tell me a story.", "Hãy kể cho tớ một câu chuyện.", "Giao tiếp", "🗣️"],
  ["Ask", "/æsk/", "verb", "Hỏi", "Ask the teacher a question.", "Hãy hỏi giáo viên một câu hỏi.", "Giao tiếp", "❓"],
  ["Answer", "/ˈæn.sɚ/", "verb", "Trả lời", "I know the answer.", "Tớ biết câu trả lời.", "Giao tiếp", "🙋"],
  ["Call", "/kɑːl/", "verb", "Gọi điện", "Call your mother.", "Hãy gọi điện cho mẹ cậu đi.", "Giao tiếp", "📞"],
  ["Shout", "/ʃaʊt/", "verb", "Hét lớn", "Don't shout in the library.", "Đừng hét lớn trong thư viện.", "Giao tiếp", "📢"],
  ["Whisper", "/ˈwɪs.pɚ/", "verb", "Thì thầm", "She whispers a secret.", "Cô ấy thì thầm một bí mật.", "Giao tiếp", "🤫"],
  ["Laugh", "/læf/", "verb", "Cười to", "We laugh at the funny joke.", "Chúng tớ cười vì câu nói đùa vui nhộn.", "Giao tiếp", "😆"],
  ["Cry", "/kraɪ/", "verb", "Khóc", "The sad movie makes me cry.", "Bộ phim buồn làm tớ khóc.", "Giao tiếp", "😭"],
  ["Smile", "/smaɪl/", "verb", "Mỉm cười", "He smiles broadly.", "Cậu ấy mỉm cười rạng rỡ.", "Giao tiếp", "🙂"],

  // --- CHỦ ĐỀ: THỜI TIẾT VÀ VŨ TRỤ (More Weather & Sky) ---
  ["Rainbow", "/ˈreɪn.boʊ/", "noun", "Cầu vồng", "There is a rainbow after the rain.", "Có cầu vồng sau cơn mưa.", "Thời tiết", "🌈"],
  ["Lightning", "/ˈlaɪt.nɪŋ/", "noun", "Tia chớp", "Lightning is very bright.", "Tia chớp rất sáng.", "Thời tiết", "🌩️"],
  ["Tornado", "/tɔːrˈneɪ.doʊ/", "noun", "Lốc xoáy", "A tornado is a strong wind.", "Lốc xoáy là cơn gió rất mạnh.", "Thời tiết", "🌪️"],
  ["Hurricane", "/ˈhɝː.ɪ.keɪn/", "noun", "Bão lốc", "The hurricane brings heavy rain.", "Bão lốc mang theo mưa lớn.", "Thời tiết", "🌀"],
  ["Droplet", "/ˈdrɑː.plət/", "noun", "Giọt nước", "A water droplet falls.", "Một giọt nước rơi xuống.", "Thời tiết", "💧"],
  ["Sunrise", "/ˈsʌn.raɪz/", "noun", "Bình minh", "The sunrise is beautiful.", "Bình minh thật rực rỡ.", "Thời tiết", "🌅"],
  ["Sunset", "/ˈsʌn.set/", "noun", "Hoàng hôn", "I watch the sunset at the beach.", "Tớ xem hoàng hôn trên bãi biển.", "Thời tiết", "🌇"],
  ["Comet", "/ˈkɑː.mɪt/", "noun", "Sao chổi", "A comet flies across the sky.", "Một ngôi sao chổi bay ngang qua bầu trời.", "Vũ trụ", "☄️"],
  ["Galaxy", "/ˈɡæl.ək.si/", "noun", "Dải ngân hà", "We live in the Milky Way galaxy.", "Chúng ta sống trong dải ngân hà Chòm Sao.", "Vũ trụ", "🌌"],
  ["Telescope", "/ˈtel.ə.skoʊp/", "noun", "Kính viễn vọng", "Look through the telescope.", "Hãy nhìn qua kính viễn vọng.", "Vũ trụ", "🔭"],

  // --- CHỦ ĐỀ: THIẾT BỊ ĐIỆN TỬ (Electronics) ---
  ["Printer", "/ˈprɪn.t̬ɚ/", "noun", "Máy in", "Print the document with the printer.", "Hãy in tài liệu bằng máy in.", "Công nghệ", "🖨️"],
  ["Tablet", "/ˈtæb.lət/", "noun", "Máy tính bảng", "I play a game on my tablet.", "Tớ chơi trò chơi trên máy tính bảng.", "Công nghệ", "📱"],
  ["Headphones", "/ˈhed.foʊnz/", "noun", "Tai nghe chụp tai", "Put on your headphones.", "Đeo tai nghe của bạn vào.", "Công nghệ", "🎧"],
  ["Earbuds", "/ˈɪr.bʌdz/", "noun", "Tai nghe nhét tai", "I use earbuds for running.", "Tớ dùng tai nghe nhét tai khi chạy bộ.", "Công nghệ", "🪽"],
  ["Router", "/ˈruː.t̬ɚ/", "noun", "Bộ định tuyến wifi", "Reboot the router for internet.", "Khởi động lại bộ định tuyến để có internet.", "Công nghệ", "📡"],
  ["Fridge", "/frɪdʒ/", "noun", "Tủ lạnh", "The milk is in the fridge.", "Sữa ở trong tủ lạnh.", "Đồ vật", "🥶"],
  ["Washing machine", "/ˈwɑː.ʃɪŋ məˌʃiːn/", "noun", "Máy giặt", "Put dirty clothes in the washing machine.", "Cho quần áo bẩn vào máy giặt.", "Đồ vật", "👕"],
  ["Microwave", "/ˈmaɪ.kroʊ.weɪv/", "noun", "Lò vi sóng", "Heat the food in the microwave.", "Hâm nóng thức ăn trong lò vi sóng.", "Đồ vật", "🍱"],
  ["Toaster", "/ˈtoʊ.stɚ/", "noun", "Máy nướng bánh mì", "The toaster pops up the bread.", "Máy nướng bật bánh mì lên.", "Đồ vật", "🍞"],
  ["Vacuum", "/ˈvæk.juːm/", "noun", "Máy hút bụi", "The vacuum cleans the carpet.", "Máy hút bụi làm sạch thảm.", "Đồ vật", "💨"],

  // --- CHỦ ĐỀ: GIA VỊ VÀ NGUYÊN LIỆU (Spices & Ingredients) ---
  ["Salt", "/sɑːlt/", "noun", "Muối", "The soup needs more salt.", "Món súp cần thêm muối.", "Gia vị", "🧂"],
  ["Sugar", "/ˈʃʊɡ.ɚ/", "noun", "Đường", "Sugar is sweet.", "Đường thì ngọt.", "Gia vị", "🍬"],
  ["Pepper", "/ˈpep.ɚ/", "noun", "Hạt tiêu", "Pepper makes me sneeze.", "Tiêu làm tớ hắt hơi.", "Gia vị", "🌶️"],
  ["Butter", "/ˈbʌt̬.ɚ/", "noun", "Bơ", "Spread butter on the bread.", "Hãy phết bơ lên bánh mì.", "Gia vị", "🧈"],
  ["Oil", "/ɔɪl/", "noun", "Dầu ăn", "Fry the egg with oil.", "Chiên trứng bằng dầu ăn.", "Gia vị", "🛢️"],
  ["Flour", "/flaʊr/", "noun", "Bột mì", "We need flour to make a cake.", "Chúng ta cần bột mì để làm bánh.", "Gia vị", "🍞"],
  ["Honey", "/ˈhʌn.i/", "noun", "Mật ong", "Bears love honey.", "Gấu rất thích mật ong.", "Gia vị", "🍯"],
  ["Garlic", "/ˈɡɑːr.lɪk/", "noun", "Củ tỏi", "Add garlic to the meat.", "Cho thêm tỏi vào thịt.", "Gia vị", "🧄"],
  ["Ginger", "/ˈdʒɪn.dʒɚ/", "noun", "Củ gừng", "Ginger tea is warm.", "Trà gừng rất ấm.", "Gia vị", "🫚"],
  ["Sauce", "/sɑːs/", "noun", "Nước sốt", "I like tomato sauce.", "Tớ thích nước sốt cà chua.", "Gia vị", "🥫"],

  // --- CHỦ ĐỀ: GIỚI TỪ VỊ TRÍ (Prepositions of Place) ---
  ["In", "/ɪn/", "prep", "Bên trong", "The pen is in the box.", "Chiếc bút ở trong hộp.", "Vị trí", "📦"],
  ["On", "/ɑːn/", "prep", "Bên trên", "The book is on the table.", "Cuốn sách ở trên bàn.", "Vị trí", "👆"],
  ["Under", "/ˈʌn.dɚ/", "prep", "Bên dưới", "The cat is under the bed.", "Con mèo ở dưới gầm giường.", "Vị trí", "👇"],
  ["Next to", "/ˈnekst tuː/", "prep", "Bên cạnh", "I sit next to my friend.", "Tớ ngồi cạnh bạn tớ.", "Vị trí", "↔️"],
  ["Behind", "/bɪˈhaɪnd/", "prep", "Đằng sau", "The sun is behind the cloud.", "Mặt trời ở đằng sau đám mây.", "Vị trí", "🔙"],
  ["In front of", "/ɪn frʌnt ʌv/", "prep", "Đằng trước", "The teacher stands in front of the class.", "Giáo viên đứng trước lớp.", "Vị trí", "🔜"],
  ["Between", "/bɪˈtwiːn/", "prep", "Ở giữa", "The nose is between the eyes.", "Mũi ở giữa hai con mắt.", "Vị trí", "🔛"],
  ["Inside", "/ɪnˈsaɪd/", "prep", "Ở phía trong", "Stay inside the house.", "Hãy ở phía trong nhà.", "Vị trí", "🚪"],
  ["Outside", "/ˈaʊt.saɪd/", "prep", "Ở phía ngoài", "Let's play outside.", "Cùng chơi ở ngoài trời nào.", "Vị trí", "🌳"],
  ["Near", "/nɪr/", "prep", "Gần", "My school is near my house.", "Trường của tớ ở gần nhà.", "Vị trí", "📍"],

  // --- CHỦ ĐỀ: TỪ NỐI VÀ ĐẠI TỪ CƠ BẢN (Connectors & Pronouns) ---
  ["I", "/aɪ/", "pronoun", "Tớ/Tôi", "I am a student.", "Tớ là một học sinh.", "Ngữ pháp", "🙋"],
  ["You", "/juː/", "pronoun", "Bạn", "You are my friend.", "Bạn là bạn của tớ.", "Ngữ pháp", "👉"],
  ["He", "/hiː/", "pronoun", "Anh ấy/Cậu ấy", "He is a good boy.", "Cậu ấy là một cậu bé tốt.", "Ngữ pháp", "👦"],
  ["She", "/ʃiː/", "pronoun", "Cô ấy/Chị ấy", "She is beautiful.", "Cô ấy thật xinh đẹp.", "Ngữ pháp", "👧"],
  ["It", "/ɪt/", "pronoun", "Nó (đồ vật/con vật)", "It is a dog.", "Nó là một con chó.", "Ngữ pháp", "🐶"],
  ["We", "/wiː/", "pronoun", "Chúng tôi/Chúng tớ", "We play together.", "Chúng tớ chơi cùng nhau.", "Ngữ pháp", "🫂"],
  ["They", "/ðeɪ/", "pronoun", "Họ/Bọn họ", "They are running.", "Họ đang chạy.", "Ngữ pháp", "🏃‍♂️"],
  ["And", "/ænd/", "conj", "Và", "I like apples and bananas.", "Tớ thích táo và chuối.", "Ngữ pháp", "➕"],
  ["But", "/bʌt/", "conj", "Nhưng", "I am small but strong.", "Tớ nhỏ bé nhưng khỏe mạnh.", "Ngữ pháp", "➖"],
  ["Because", "/bɪˈkəz/", "conj", "Bởi vì", "I sleep because I am tired.", "Tớ ngủ vì tớ mệt.", "Ngữ pháp", "🤷"],

  // --- CHỦ ĐỀ: TÍNH TỪ CHỈ TỐC ĐỘ VÀ NHIỆT ĐỘ (Speed & Temp) ---
  ["Fast", "/fæst/", "adj", "Nhanh", "The cheetah runs fast.", "Báo đốm chạy rất nhanh.", "Tính từ", "⚡"],
  ["Slow", "/sloʊ/", "adj", "Chậm", "The turtle is slow.", "Con rùa rất chậm.", "Tính từ", "🐢"],
  ["Quick", "/kwɪk/", "adj", "Nhanh chóng", "Be quick!", "Nhanh lên nào!", "Tính từ", "⏱️"],
  ["Loud", "/laʊd/", "adj", "To (âm thanh)", "The music is too loud.", "Nhạc quá to.", "Tính từ", "🔊"],
  ["Soft", "/sɑːft/", "adj", "Mềm mại", "The pillow is soft.", "Chiếc gối thật mềm mại.", "Tính từ", "☁️"],
  ["Hard", "/hɑːrd/", "adj", "Cứng / Khó", "The rock is hard.", "Hòn đá rất cứng.", "Tính từ", "🪨"],
  ["Sharp", "/ʃɑːrp/", "adj", "Sắc nhọn", "The knife is sharp.", "Con dao rất sắc.", "Tính từ", "🔪"],
  ["Smooth", "/smuːð/", "adj", "Nhẵn bóng", "The glass is smooth.", "Mặt kính rất nhẵn.", "Tính từ", "🪞"],
  ["Rough", "/rʌf/", "adj", "Thô ráp", "The tree bark is rough.", "Vỏ cây rất thô ráp.", "Tính từ", "🌳"],
  ["Sticky", "/ˈstɪk.i/", "adj", "Dính", "Candy is sticky.", "Kẹo rất dính.", "Tính từ", "🍯"],

  // --- CHỦ ĐỀ: ĐỘNG VẬT HOANG DÃ (Wild Animals) ---
  ["Gorilla", "/ɡəˈrɪl.ə/", "noun", "Khỉ đột", "The gorilla is strong.", "Khỉ đột rất khỏe.", "Động vật hoang dã", "🦍"],
  ["Zebra", "/ˈziː.brə/", "noun", "Ngựa vằn", "Zebras have stripes.", "Ngựa vằn có sọc.", "Động vật hoang dã", "🦓"],
  ["Giraffe", "/dʒɪˈræf/", "noun", "Hươu cao cổ", "Giraffes are tall.", "Hươu cao cổ rất cao.", "Động vật hoang dã", "🦒"],
  ["Rhino", "/ˈraɪ.noʊ/", "noun", "Tê giác", "Rhinos have horns.", "Tê giác có sừng.", "Động vật hoang dã", "🦏"],
  ["Hippo", "/ˈhɪp.oʊ/", "noun", "Hà mã", "Hippos like water.", "Hà mã thích nước.", "Động vật hoang dã", "🦛"],
  ["Kangaroo", "/ˌkæŋ.ɡəˈruː/", "noun", "Chuột túi", "Kangaroos can jump.", "Chuột túi biết nhảy.", "Động vật hoang dã", "🦘"],
  ["Camel", "/ˈkæm.əl/", "noun", "Lạc đà", "Camels live in deserts.", "Lạc đà sống ở sa mạc.", "Động vật hoang dã", "🐪"],
  ["Koala", "/koʊˈɑː.lə/", "noun", "Gấu Koala", "Koalas eat leaves.", "Gấu Koala ăn lá cây.", "Động vật hoang dã", "🐨"],
  ["Panda", "/ˈpæn.də/", "noun", "Gấu trúc", "Pandas eat bamboo.", "Gấu trúc ăn tre nứa.", "Động vật hoang dã", "🐼"],
  ["Sloth", "/slɑːθ/", "noun", "Con lười", "Sloths are very slow.", "Con lười rất chậm chạp.", "Động vật hoang dã", "🦥"],

  // --- CHỦ ĐỀ: CHIM CHÓC (Birds) ---
  ["Eagle", "/ˈiː.ɡəl/", "noun", "Đại bàng", "Eagles fly high.", "Đại bàng bay cao.", "Chim chóc", "🦅"],
  ["Owl", "/aʊl/", "noun", "Cú mèo", "Owls hunt at night.", "Cú mèo săn mồi ban đêm.", "Chim chóc", "🦉"],
  ["Swan", "/swɑːn/", "noun", "Thiên nga", "The swan is white.", "Thiên nga màu trắng.", "Chim chóc", "🦢"],
  ["Flamingo", "/fləˈmɪŋ.ɡoʊ/", "noun", "Hồng hạc", "Flamingos are pink.", "Hồng hạc màu hồng.", "Chim chóc", "🦩"],
  ["Peacock", "/ˈpiː.kɑːk/", "noun", "Con công", "The peacock is beautiful.", "Con công rất đẹp.", "Chim chóc", "🦚"],
  ["Pigeon", "/ˈpɪdʒ.ən/", "noun", "Bồ câu", "Pigeons live in cities.", "Bồ câu sống ở thành phố.", "Chim chóc", "🕊️"],
  ["Crow", "/kroʊ/", "noun", "Con quạ", "The crow is black.", "Con quạ màu đen.", "Chim chóc", "🐦‍⬛"],
  ["Woodpecker", "/ˈwʊdˌpek.ɚ/", "noun", "Chim gõ kiến", "It pecks wood.", "Nó gõ vào thân gỗ.", "Chim chóc", "🪵"],
  ["Ostrich", "/ˈɑː.strɪtʃ/", "noun", "Đà điểu", "Ostriches run fast.", "Đà điểu chạy rất nhanh.", "Chim chóc", "🪶"],
  ["Hawk", "/hɑːk/", "noun", "Diều hâu", "Hawks have sharp eyes.", "Diều hâu có mắt tinh.", "Chim chóc", "🦅"],

  // --- CHỦ ĐỀ: NÔNG TRẠI (Farm Animals) ---
  ["Donkey", "/ˈdɑːŋ.ki/", "noun", "Con lừa", "The donkey works hard.", "Con lừa làm việc chăm chỉ.", "Nông trại", "🫏"],
  ["Goat", "/ɡoʊt/", "noun", "Con dê", "Goats eat grass.", "Con dê ăn cỏ.", "Nông trại", "🐐"],
  ["Turkey", "/ˈtɝː.ki/", "noun", "Gà tây", "A big turkey.", "Một con gà tây lớn.", "Nông trại", "🦃"],
  ["Rooster", "/ˈruː.stɚ/", "noun", "Gà trống", "The rooster crows.", "Gà trống gáy.", "Nông trại", "🐓"],
  ["Goose", "/ɡuːs/", "noun", "Con ngỗng", "The goose honks.", "Con ngỗng kêu.", "Nông trại", "🪿"],
  ["Pony", "/ˈpoʊ.ni/", "noun", "Ngựa lùn", "I ride a pony.", "Tớ cưỡi ngựa lùn.", "Nông trại", "🐴"],
  ["Ox", "/ɑːks/", "noun", "Con bò đực", "The ox is strong.", "Con bò đực rất khỏe.", "Nông trại", "🐂"],
  ["Mule", "/mjuːl/", "noun", "Con la", "The mule carries bags.", "Con la chở đồ.", "Nông trại", "🫏"],
  ["Bull", "/bʊl/", "noun", "Bò tót", "The bull is angry.", "Con bò tót tức giận.", "Nông trại", "🐃"],
  ["Calf", "/kæf/", "noun", "Con bê", "The calf is cute.", "Con bê rất dễ thương.", "Nông trại", "🐄"],

  // --- CHỦ ĐỀ: TRÁI CÂY 2 (Fruits 2) ---
  ["Watermelon", "/ˈwɑː.t̬ɚˌmel.ən/", "noun", "Dưa hấu", "Watermelon is sweet.", "Dưa hấu rất ngọt.", "Trái cây 2", "🍉"],
  ["Melon", "/ˈmel.ən/", "noun", "Dưa lưới", "I like yellow melon.", "Tớ thích dưa lưới vàng.", "Trái cây 2", "🍈"],
  ["Strawberry", "/ˈstrɑːˌber.i/", "noun", "Dâu tây", "Strawberries are red.", "Dâu tây màu đỏ.", "Trái cây 2", "🍓"],
  ["Blueberry", "/ˈbluːˌber.i/", "noun", "Việt quất", "I eat blueberries.", "Tớ ăn việt quất.", "Trái cây 2", "🫐"],
  ["Raspberry", "/ˈræz.ber.i/", "noun", "Mâm xôi", "Raspberry is sour.", "Quả mâm xôi hơi chua.", "Trái cây 2", "🍒"],
  ["Kiwi", "/ˈkiː.wi/", "noun", "Quả Kiwi", "Kiwi is green inside.", "Kiwi có ruột xanh.", "Trái cây 2", "🥝"],
  ["Fig", "/fɪɡ/", "noun", "Quả sung", "This fig is soft.", "Quả sung này mềm.", "Trái cây 2", "🍏"],
  ["Pomegranate", "/ˈpɑː.məˌɡræn.ɪt/", "noun", "Quả lựu", "Pomegranate has many seeds.", "Quả lựu có nhiều hạt.", "Trái cây 2", "🍎"],
  ["Apricot", "/ˈæp.rɪ.kɑːt/", "noun", "Quả mơ", "Apricot is orange.", "Quả mơ màu cam.", "Trái cây 2", "🍑"],
  ["Avocado", "/ˌæv.əˈkɑː.doʊ/", "noun", "Quả bơ", "Avocado is healthy.", "Quả bơ rất tốt cho sức khỏe.", "Trái cây 2", "🥑"],

  // --- CHỦ ĐỀ: RAU CỦ 2 (Vegetables 2) ---
  ["Broccoli", "/ˈbrɑː.kəl.i/", "noun", "Súp lơ xanh", "Broccoli looks like a tree.", "Súp lơ trông giống cái cây.", "Rau củ 2", "🥦"],
  ["Celery", "/ˈsel.ɚ.i/", "noun", "Cần tây", "I eat celery with dip.", "Tớ ăn cần tây với nước xốt.", "Rau củ 2", "🥬"],
  ["Spinach", "/ˈspɪn.ɪtʃ/", "noun", "Rau chân vịt", "Spinach makes you strong.", "Rau chân vịt giúp bạn khỏe.", "Rau củ 2", "🍃"],
  ["Lettuce", "/ˈlet̬.ɪs/", "noun", "Xà lách", "Lettuce is in the salad.", "Xà lách có trong món rau trộn.", "Rau củ 2", "🥗"],
  ["Radish", "/ˈræd.ɪʃ/", "noun", "Củ cải", "The radish is red.", "Củ cải màu đỏ.", "Rau củ 2", "🫚"],
  ["Eggplant", "/ˈeɡ.plænt/", "noun", "Cà tím", "Eggplant is purple.", "Cà tím có màu tím.", "Rau củ 2", "🍆"],
  ["Zucchini", "/zuˈkiː.ni/", "noun", "Bí ngòi", "I like grilled zucchini.", "Tớ thích bí ngòi nướng.", "Rau củ 2", "🥒"],
  ["Pea", "/piː/", "noun", "Hạt đậu", "Peas are small and green.", "Hạt đậu nhỏ và xanh.", "Rau củ 2", "🫛"],
  ["Bean", "/biːn/", "noun", "Đỗ, đậu", "Beans are good food.", "Đỗ rất ngon.", "Rau củ 2", "🫘"],
  ["Asparagus", "/əˈsper.ə.ɡəs/", "noun", "Măng tây", "Cook the asparagus.", "Hãy nấu măng tây.", "Rau củ 2", "🎋"],

  // --- CHỦ ĐỀ: MÓN ĂN SÁNG (Breakfast) ---
  ["Cereal", "/ˈsɪr.i.əl/", "noun", "Ngũ cốc", "I eat cereal with milk.", "Tớ ăn ngũ cốc với sữa.", "Món ăn sáng", "🥣"],
  ["Oatmeal", "/ˈoʊt.miːl/", "noun", "Bột yến mạch", "Oatmeal is warm.", "Bột yến mạch rất ấm.", "Món ăn sáng", "🍲"],
  ["Pancake", "/ˈpæn.keɪk/", "noun", "Bánh kếp", "Pancakes with syrup.", "Bánh kếp với si-rô.", "Món ăn sáng", "🥞"],
  ["Waffle", "/ˈwɑː.fəl/", "noun", "Bánh tổ ong", "I like crispy waffles.", "Tớ thích bánh tổ ong giòn.", "Món ăn sáng", "🧇"],
  ["Bacon", "/ˈbeɪ.kən/", "noun", "Thịt xông khói", "Bacon smells good.", "Thịt xông khói rất thơm.", "Món ăn sáng", "🥓"],
  ["Sausage", "/ˈsɑː.sɪdʒ/", "noun", "Xúc xích", "Eat the sausage.", "Hãy ăn xúc xích.", "Món ăn sáng", "🌭"],
  ["Toast", "/toʊst/", "noun", "Bánh mì nướng", "Toast with butter.", "Bánh mì nướng với bơ.", "Món ăn sáng", "🍞"],
  ["Croissant", "/kwɑːˈsɑ̃ː/", "noun", "Bánh sừng bò", "A fresh croissant.", "Một chiếc bánh sừng bò mới ra lò.", "Món ăn sáng", "🥐"],
  ["Yogurt", "/ˈjoʊ.ɡɚt/", "noun", "Sữa chua", "Yogurt is healthy.", "Sữa chua rất tốt.", "Món ăn sáng", "🥛"],
  ["Omelet", "/ˈɑːm.lət/", "noun", "Trứng ốp lết", "A cheese omelet.", "Trứng ốp lết phô mai.", "Món ăn sáng", "🍳"],

  // --- CHỦ ĐỀ: TRÁNG MIỆNG (Desserts) ---
  ["Pudding", "/ˈpʊd.ɪŋ/", "noun", "Bánh pudding", "Chocolate pudding.", "Bánh pudding sô-cô-la.", "Tráng miệng", "🍮"],
  ["Jelly", "/ˈdʒel.i/", "noun", "Thạch", "Jelly is wobbly.", "Thạch rung rinh.", "Tráng miệng", "🧫"],
  ["Ice cream", "/ˈaɪs ˌkriːm/", "noun", "Kem", "I love ice cream.", "Tớ yêu kem.", "Tráng miệng", "🍦"],
  ["Brownie", "/ˈbraʊ.ni/", "noun", "Bánh sô-cô-la", "A sweet brownie.", "Bánh sô-cô-la ngọt ngào.", "Tráng miệng", "🥮"],
  ["Cookie", "/ˈkʊk.i/", "noun", "Bánh quy", "Bake some cookies.", "Hãy nướng bánh quy.", "Tráng miệng", "🍪"],
  ["Donut", "/ˈdoʊ.nʌt/", "noun", "Bánh donut", "A donut with sprinkles.", "Bánh donut có hạt đường.", "Tráng miệng", "🍩"],
  ["Muffin", "/ˈmʌf.ɪn/", "noun", "Bánh xốp muffin", "A blueberry muffin.", "Bánh xốp việt quất.", "Tráng miệng", "🧁"],
  ["Pie", "/paɪ/", "noun", "Bánh nướng tròn", "Apple pie is hot.", "Bánh nướng táo rất nóng.", "Tráng miệng", "🥧"],
  ["Tart", "/tɑːrt/", "noun", "Bánh tart", "A fruit tart.", "Bánh tart trái cây.", "Tráng miệng", "🥮"],
  ["Cupcake", "/ˈkʌp.keɪk/", "noun", "Bánh kem nhỏ", "A pink cupcake.", "Bánh kem nhỏ màu hồng.", "Tráng miệng", "🧁"],

  // --- CHỦ ĐỀ: ĐỒ ĂN NHANH (Fast Food) ---
  ["Burger", "/ˈbɝː.ɡɚ/", "noun", "Bánh kẹp thịt", "A big burger.", "Một chiếc bánh kẹp lớn.", "Đồ ăn nhanh", "🍔"],
  ["Hotdog", "/ˈhɑːt.dɑːɡ/", "noun", "Bánh mì xúc xích", "Hotdog with mustard.", "Bánh mì xúc xích với mù tạt.", "Đồ ăn nhanh", "🌭"],
  ["French fries", "/ˈfrentʃ ˌfraɪz/", "noun", "Khoai tây chiên", "I like french fries.", "Tớ thích khoai tây chiên.", "Đồ ăn nhanh", "🍟"],
  ["Fried chicken", "/fraɪd ˈtʃɪk.ɪn/", "noun", "Gà rán", "Crispy fried chicken.", "Gà rán giòn rụm.", "Đồ ăn nhanh", "🍗"],
  ["Taco", "/ˈtɑː.koʊ/", "noun", "Bánh Taco", "A spicy taco.", "Bánh taco cay.", "Đồ ăn nhanh", "🌮"],
  ["Burrito", "/bəˈriː.t̬oʊ/", "noun", "Bánh Burrito", "A beef burrito.", "Bánh burrito thịt bò.", "Đồ ăn nhanh", "🌯"],
  ["Kebab", "/kəˈbɑːb/", "noun", "Thịt xiên nướng", "Meat on a kebab.", "Thịt trên xiên nướng.", "Đồ ăn nhanh", "🍢"],
  ["Sushi", "/ˈsuː.ʃi/", "noun", "Cơm cuộn", "I eat sushi.", "Tớ ăn cơm cuộn.", "Đồ ăn nhanh", "🍣"],
  ["Pasta", "/ˈpɑː.stə/", "noun", "Mì Ý", "Pasta with tomato sauce.", "Mì Ý với xốt cà chua.", "Đồ ăn nhanh", "🍝"],
  ["Steak", "/steɪk/", "noun", "Bít tết", "A juicy steak.", "Miếng bít tết mọng nước.", "Đồ ăn nhanh", "🥩"],

  // --- CHỦ ĐỀ: ĐỒ UỐNG 2 (Drinks 2) ---
  ["Lemonade", "/ˌlem.əˈneɪd/", "noun", "Nước chanh", "Ice cold lemonade.", "Nước chanh đá mát lạnh.", "Đồ uống 2", "🍋"],
  ["Smoothie", "/ˈsmuː.ði/", "noun", "Sinh tố", "A fruit smoothie.", "Sinh tố trái cây.", "Đồ uống 2", "🥤"],
  ["Milkshake", "/ˈmɪlk.ʃeɪk/", "noun", "Sữa lắc", "Strawberry milkshake.", "Sữa lắc dâu tây.", "Đồ uống 2", "🧋"],
  ["Cola", "/ˈkoʊ.lə/", "noun", "Nước ngọt Cola", "A glass of cola.", "Một ly nước cola.", "Đồ uống 2", "🥤"],
  ["Water", "/ˈwɑː.t̬ɚ/", "noun", "Nước lọc", "Drink pure water.", "Hãy uống nước tinh khiết.", "Đồ uống 2", "💧"],
  ["Beer", "/bɪr/", "noun", "Bia", "Adults drink beer.", "Người lớn uống bia.", "Đồ uống 2", "🍺"],
  ["Wine", "/waɪn/", "noun", "Rượu vang", "Red wine.", "Rượu vang đỏ.", "Đồ uống 2", "🍷"],
  ["Champagne", "/ʃæmˈpeɪn/", "noun", "Sâm panh", "Pop the champagne.", "Mở rượu sâm panh.", "Đồ uống 2", "🍾"],
  ["Cocktail", "/ˈkɑːk.teɪl/", "noun", "Cốc-tai", "A colorful cocktail.", "Một ly cốc-tai đầy màu sắc.", "Đồ uống 2", "🍹"],
  ["Cocoa", "/ˈkoʊ.koʊ/", "noun", "Ca-cao", "Hot cocoa is cozy.", "Ca-cao nóng rất ấm cúng.", "Đồ uống 2", "☕"],

  // --- CHỦ ĐỀ: PHƯƠNG TIỆN 2 (Vehicles 2) ---
  ["Taxi", "/ˈtæk.si/", "noun", "Xe tắc-xi", "Call a taxi.", "Hãy gọi xe tắc-xi.", "Phương tiện 2", "🚕"],
  ["Subway", "/ˈsʌb.weɪ/", "noun", "Tàu điện ngầm", "Take the subway.", "Đi tàu điện ngầm.", "Phương tiện 2", "🚇"],
  ["Tram", "/træm/", "noun", "Xe điện", "The tram on the street.", "Xe điện trên phố.", "Phương tiện 2", "🚋"],
  ["Van", "/væn/", "noun", "Xe tải nhỏ", "A white van.", "Một chiếc xe tải nhỏ màu trắng.", "Phương tiện 2", "🚐"],
  ["Scooter", "/ˈskuː.t̬ɚ/", "noun", "Xe tay ga/trượt", "Ride a scooter.", "Đi xe scooter.", "Phương tiện 2", "🛴"],
  ["Skateboard", "/ˈskeɪt.bɔːrd/", "noun", "Ván trượt", "Do a trick on the skateboard.", "Làm xiếc trên ván trượt.", "Phương tiện 2", "🛹"],
  ["Tractor", "/ˈtræk.tɚ/", "noun", "Máy kéo", "The tractor is on the farm.", "Máy kéo ở nông trại.", "Phương tiện 2", "🚜"],
  ["Ambulance", "/ˈæm.bjə.ləns/", "noun", "Xe cứu thương", "The ambulance is fast.", "Xe cứu thương chạy rất nhanh.", "Phương tiện 2", "🚑"],
  ["Fire engine", "/ˈfaɪr ˌen.dʒɪn/", "noun", "Xe cứu hỏa", "The red fire engine.", "Xe cứu hỏa màu đỏ.", "Phương tiện 2", "🚒"],
  ["Police car", "/pəˈliːs ˌkɑːr/", "noun", "Xe cảnh sát", "The police car has sirens.", "Xe cảnh sát có còi hụ.", "Phương tiện 2", "🚓"],

  // --- CHỦ ĐỀ: CỬA HÀNG (Shops) ---
  ["Bakery", "/ˈbeɪ.kɚ.i/", "noun", "Tiệm bánh", "Buy bread at the bakery.", "Mua bánh mì ở tiệm bánh.", "Cửa hàng", "🥖"],
  ["Pharmacy", "/ˈfɑːr.mə.si/", "noun", "Tiệm thuốc", "Get medicine at the pharmacy.", "Mua thuốc ở tiệm thuốc.", "Cửa hàng", "💊"],
  ["Bookstore", "/ˈbʊk.stɔːr/", "noun", "Nhà sách", "I buy books at the bookstore.", "Tớ mua sách ở nhà sách.", "Cửa hàng", "📚"],
  ["Toy store", "/tɔɪ stɔːr/", "noun", "Cửa hàng đồ chơi", "Kids love the toy store.", "Trẻ em yêu cửa hàng đồ chơi.", "Cửa hàng", "🧸"],
  ["Pet shop", "/pet ʃɑːp/", "noun", "Cửa hàng thú cưng", "Look at the dogs in the pet shop.", "Nhìn chú chó trong tiệm thú cưng.", "Cửa hàng", "🐕"],
  ["Mall", "/mɑːl/", "noun", "Trung tâm thương mại", "Shop at the big mall.", "Mua sắm ở trung tâm thương mại.", "Cửa hàng", "🏬"],
  ["Market", "/ˈmɑːr.kɪt/", "noun", "Cái Chợ", "Fresh food at the market.", "Thực phẩm tươi ở chợ.", "Cửa hàng", "🛒"],
  ["Boutique", "/buːˈtiːk/", "noun", "Cửa hàng thời trang", "Buy clothes in a boutique.", "Mua đồ trong cửa hàng thời trang.", "Cửa hàng", "👗"],
  ["Kiosk", "/ˈkiː.ɑːsk/", "noun", "Quầy bán hàng", "A small kiosk.", "Một quầy bán hàng nhỏ.", "Cửa hàng", "🏪"],
  ["Stall", "/stɑːl/", "noun", "Sạp hàng", "A fruit stall.", "Một sạp bán trái cây.", "Cửa hàng", "⛺"],

  // --- CHỦ ĐỀ: DỤNG CỤ HỌC TẬP (School Supplies) ---
  ["Backpack", "/ˈbæk.pæk/", "noun", "Ba-lô", "Put books in the backpack.", "Bỏ sách vào ba-lô.", "Dụng cụ học tập", "🎒"],
  ["Chalk", "/tʃɑːk/", "noun", "Viên Phấn", "Write with chalk.", "Viết bằng phấn.", "Dụng cụ học tập", "🖍️"],
  ["Marker", "/ˈmɑːr.kɚ/", "noun", "Bút dạ/bút lông", "Use a red marker.", "Dùng bút lông đỏ.", "Dụng cụ học tập", "🖊️"],
  ["Highlighter", "/ˈhaɪˌlaɪ.t̬ɚ/", "noun", "Bút dạ quang", "Highlight the text.", "Tô sáng dòng chữ.", "Dụng cụ học tập", "🖍️"],
  ["Compass", "/ˈkʌm.pəs/", "noun", "Com-pa", "Draw a circle with a compass.", "Vẽ vòng tròn bằng com-pa.", "Dụng cụ học tập", "✏️"],
  ["Protractor", "/prəˈtræk.tɚ/", "noun", "Thước đo độ", "Measure the angle with a protractor.", "Đo góc bằng thước đo độ.", "Dụng cụ học tập", "📏"],
  ["Folder", "/ˈfoʊl.dɚ/", "noun", "Bìa kẹp hồ sơ", "Keep papers in a folder.", "Giữ giấy tờ trong bìa kẹp.", "Dụng cụ học tập", "📁"],
  ["File", "/faɪl/", "noun", "Tập tài liệu", "An important file.", "Một tập tài liệu quan trọng.", "Dụng cụ học tập", "📄"],
  ["Scissors", "/ˈsɪz.ɚz/", "noun", "Cái kéo", "Cut paper with scissors.", "Cắt giấy bằng kéo.", "Dụng cụ học tập", "✂️"],
  ["Glue", "/ɡluː/", "noun", "Hồ dán", "Stick it with glue.", "Dính nó lại bằng hồ dán.", "Dụng cụ học tập", "🧴"],

  // --- CHỦ ĐỀ: CÔNG CỤ (Tools) ---
  ["Hammer", "/ˈhæm.ɚ/", "noun", "Cái búa", "Hit the nail with a hammer.", "Đóng đinh bằng búa.", "Công cụ", "🔨"],
  ["Wrench", "/rentʃ/", "noun", "Cờ lê", "Turn it with a wrench.", "Vặn nó bằng cờ lê.", "Công cụ", "🔧"],
  ["Screwdriver", "/ˈskruːˌdraɪ.vɚ/", "noun", "Tua vít", "Use a screwdriver.", "Sử dụng tua vít.", "Công cụ", "🪛"],
  ["Saw", "/sɑː/", "noun", "Cái cưa", "Cut wood with a saw.", "Cắt gỗ bằng cưa.", "Công cụ", "🪚"],
  ["Drill", "/drɪl/", "noun", "Máy khoan", "Make a hole with a drill.", "Khoan một cái lỗ bằng máy.", "Công cụ", "🪛"],
  ["Plier", "/ˈplaɪ.ɚz/", "noun", "Cái kìm", "Hold it with pliers.", "Kẹp nó bằng kìm.", "Công cụ", "🗜️"],
  ["Nail", "/neɪl/", "noun", "Cái đinh", "A sharp metal nail.", "Một cái đinh kim loại nhọn.", "Công cụ", "📍"],
  ["Screw", "/skruː/", "noun", "Đinh ốc", "Twist the screw.", "Vặn đinh ốc.", "Công cụ", "🔩"],
  ["Axe", "/æks/", "noun", "Cái rìu", "Chop wood with an axe.", "Bổ củi bằng rìu.", "Công cụ", "🪓"],
  ["Shovel", "/ˈʃʌv.əl/", "noun", "Cái xẻng", "Dig dirt with a shovel.", "Đào đất bằng xẻng.", "Công cụ", "⛏️"],

  // --- CHỦ ĐỀ: PHƯƠNG HƯỚNG (Directions) ---
  ["North", "/nɔːrθ/", "noun", "Hướng Bắc", "Go north.", "Đi về hướng Bắc.", "Phương hướng", "⬆️"],
  ["South", "/saʊθ/", "noun", "Hướng Nam", "Birds fly south.", "Chim bay về phương Nam.", "Phương hướng", "⬇️"],
  ["East", "/iːst/", "noun", "Hướng Đông", "The sun rises in the east.", "Mặt trời mọc hướng Đông.", "Phương hướng", "➡️"],
  ["West", "/west/", "noun", "Hướng Tây", "The sun sets in the west.", "Mặt trời lặn hướng Tây.", "Phương hướng", "⬅️"],
  ["Up", "/ʌp/", "adv", "Lên trên", "Look up at the sky.", "Nhìn lên bầu trời.", "Phương hướng", "🔼"],
  ["Down", "/daʊn/", "adv", "Xuống dưới", "Sit down.", "Ngồi xuống.", "Phương hướng", "🔽"],
  ["Left", "/left/", "adv", "Bên trái", "Turn left here.", "Rẽ trái ở đây.", "Phương hướng", "👈"],
  ["Right", "/raɪt/", "adv", "Bên phải", "Your right hand.", "Tay phải của bạn.", "Phương hướng", "👉"],
  ["Forward", "/ˈfɔːr.wɚd/", "adv", "Về phía trước", "Step forward.", "Bước về phía trước.", "Phương hướng", "⏭️"],
  ["Backward", "/ˈbæk.wɚd/", "adv", "Về phía sau", "Take a step backward.", "Lùi lại một bước.", "Phương hướng", "⏮️"],

  // --- CHỦ ĐỀ: QUẦN ÁO 2 (Clothes 2) ---
  ["Coat", "/koʊt/", "noun", "Áo choàng", "Wear a warm coat.", "Mặc áo choàng ấm.", "Quần áo 2", "🧥"],
  ["Sweater", "/ˈswet̬.ɚ/", "noun", "Áo len", "A cozy wool sweater.", "Một chiếc áo len ấm cúng.", "Quần áo 2", "🧶"],
  ["Suit", "/suːt/", "noun", "Bộ com-lê", "He wears a nice suit.", "Anh ấy mặc một bộ com-lê đẹp.", "Quần áo 2", "🕴️"],
  ["Uniform", "/ˈjuː.nə.fɔːrm/", "noun", "Đồng phục", "A school uniform.", "Đồng phục học sinh.", "Quần áo 2", "🧑‍🎓"],
  ["Vest", "/vest/", "noun", "Áo ghi-lê", "A formal vest.", "Áo ghi-lê trang trọng.", "Quần áo 2", "🦺"],
  ["Tie", "/taɪ/", "noun", "Cà vạt", "A red tie.", "Một chiếc cà vạt đỏ.", "Quần áo 2", "👔"],
  ["Bowtie", "/ˈboʊ.taɪ/", "noun", "Nơ đeo cổ", "A black bowtie.", "Nơ đeo cổ màu đen.", "Quần áo 2", "🎀"],
  ["Shorts", "/ʃɔːrts/", "noun", "Quần đùi", "I wear shorts in summer.", "Tớ mặc quần đùi vào mùa hè.", "Quần áo 2", "🩳"],
  ["Jeans", "/dʒiːnz/", "noun", "Quần bò", "Blue jeans.", "Quần bò xanh.", "Quần áo 2", "👖"],
  ["Leggings", "/ˈleɡ.ɪŋz/", "noun", "Quần ôm sát", "Comfortable leggings.", "Quần ôm sát thoải mái.", "Quần áo 2", "🩳"],

  // --- CHỦ ĐỀ: HOẠT ĐỘNG NGOÀI TRỜI (Outdoor Activities) ---
  ["Picnic", "/ˈpɪk.nɪk/", "noun", "Đi dã ngoại", "Have a picnic in the park.", "Đi dã ngoại trong công viên.", "Ngoài trời", "🧺"],
  ["Hiking", "/ˈhaɪ.kɪŋ/", "noun", "Đi bộ đường dài", "Go hiking in the mountains.", "Đi bộ trên núi.", "Ngoài trời", "🥾"],
  ["Fishing", "/ˈfɪʃ.ɪŋ/", "noun", "Câu cá", "He loves fishing.", "Ông ấy thích câu cá.", "Ngoài trời", "🎣"],
  ["Hunting", "/ˈhʌn.tɪŋ/", "noun", "Săn bắn", "Hunting in the forest.", "Săn bắn trong rừng.", "Ngoài trời", "🏹"],
  ["Boating", "/ˈboʊ.t̬ɪŋ/", "noun", "Chèo thuyền", "Boating on the lake.", "Chèo thuyền trên hồ.", "Ngoài trời", "🚣"],
  ["Sailing", "/ˈseɪ.lɪŋ/", "noun", "Căng buồm", "Sailing on the ocean.", "Căng buồm trên đại dương.", "Ngoài trời", "⛵"],
  ["Diving", "/ˈdaɪ.vɪŋ/", "noun", "Lặn", "Diving deep in the sea.", "Lặn sâu dưới biển.", "Ngoài trời", "🤿"],
  ["Skating", "/ˈskeɪ.t̬ɪŋ/", "noun", "Trượt băng", "Ice skating is fun.", "Trượt băng rất vui.", "Ngoài trời", "⛸️"],
  ["Skiing", "/ˈskiː.ɪŋ/", "noun", "Trượt tuyết", "Skiing down the hill.", "Trượt tuyết xuống đồi.", "Ngoài trời", "🎿"],
  ["Sledding", "/ˈsled.ɪŋ/", "noun", "Trượt xe tuyết", "Sledding in winter.", "Trượt xe tuyết mùa đông.", "Ngoài trời", "🛷"],

  // --- CHỦ ĐỀ: SINH HOẠT HẰNG NGÀY (Daily Routine) ---
  ["Wake up", "/weɪk ʌp/", "verb", "Thức giấc", "I wake up early.", "Tớ thức giấc sớm.", "Sinh hoạt", "🥱"],
  ["Get up", "/ɡet ʌp/", "verb", "Rời giường", "Get up now!", "Ra khỏi giường ngay!", "Sinh hoạt", "🛏️"],
  ["Shower", "/ˈʃaʊ.ɚ/", "verb", "Tắm vòi sen", "Take a shower.", "Đi tắm vòi sen.", "Sinh hoạt", "🚿"],
  ["Brush", "/brʌʃ/", "verb", "Đánh răng", "Brush your teeth.", "Hãy đánh răng.", "Sinh hoạt", "🪥"],
  ["Dress", "/dres/", "verb", "Mặc đồ", "Get dressed for school.", "Mặc đồ để đi học.", "Sinh hoạt", "👕"],
  ["Work", "/wɝːk/", "verb", "Làm việc", "Parents go to work.", "Bố mẹ đi làm.", "Sinh hoạt", "💼"],
  ["Study", "/ˈstʌd.i/", "verb", "Học tập", "Study hard.", "Hãy học tập chăm chỉ.", "Sinh hoạt", "📖"],
  ["Rest", "/rest/", "verb", "Nghỉ ngơi", "Take a short rest.", "Nghỉ ngơi một lát.", "Sinh hoạt", "🛋️"],
  ["Relax", "/rɪˈlæks/", "verb", "Thư giãn", "Relax on the sofa.", "Thư giãn trên ghế sô-pha.", "Sinh hoạt", "🧘"],
  ["Sleep", "/sliːp/", "verb", "Đi ngủ", "Go to sleep.", "Đi ngủ đi.", "Sinh hoạt", "😴"],

  // --- CHỦ ĐỀ: ĐỘNG TỪ CẢM XÚC (Emotion Verbs) ---
  ["Love", "/lʌv/", "verb", "Yêu", "I love my family.", "Tớ yêu gia đình tớ.", "Động từ cảm xúc", "❤️"],
  ["Like", "/laɪk/", "verb", "Thích", "I like apples.", "Tớ thích quả táo.", "Động từ cảm xúc", "👍"],
  ["Hate", "/heɪt/", "verb", "Ghét", "I hate bad weather.", "Tớ ghét thời tiết xấu.", "Động từ cảm xúc", "👎"],
  ["Dislike", "/dɪsˈlaɪk/", "verb", "Không thích", "He dislikes spiders.", "Cậu không thích nhện.", "Động từ cảm xúc", "🙅"],
  ["Enjoy", "/ɪnˈdʒɔɪ/", "verb", "Thưởng thức", "Enjoy the movie.", "Thưởng thức bộ phim nhé.", "Động từ cảm xúc", "🍿"],
  ["Prefer", "/prɪˈfɝː/", "verb", "Thích hơn", "I prefer tea to coffee.", "Tớ thích trà hơn cà phê.", "Động từ cảm xúc", "☕"],
  ["Care", "/ker/", "verb", "Quan tâm", "I care about you.", "Tớ quan tâm đến bạn.", "Động từ cảm xúc", "🫂"],
  ["Miss", "/mɪs/", "verb", "Nhớ (nhung)", "I miss my grandma.", "Tớ nhớ bà của tớ.", "Động từ cảm xúc", "🥺"],
  ["Need", "/niːd/", "verb", "Cần", "I need water.", "Tớ cần nước.", "Động từ cảm xúc", "🙏"],
  ["Want", "/wɑːnt/", "verb", "Muốn", "I want a toy.", "Tớ muốn đồ chơi.", "Động từ cảm xúc", "🧸"],

  // --- CHỦ ĐỀ: HÀNH ĐỘNG TAY (Hand Actions) ---
  ["Hold", "/hoʊld/", "verb", "Cầm, Nắm", "Hold my hand.", "Hãy nắm tay tớ.", "Hành động tay", "🤝"],
  ["Touch", "/tʌtʃ/", "verb", "Chạm vào", "Do not touch the art.", "Đừng chạm vào tác phẩm.", "Hành động tay", "👆"],
  ["Grab", "/ɡræb/", "verb", "Chộp lấy", "Grab the ball.", "Hãy chộp lấy quả bóng.", "Hành động tay", "✊"],
  ["Point", "/pɔɪnt/", "verb", "Chỉ trỏ", "Point to the picture.", "Hãy chỉ vào bức tranh.", "Hành động tay", "👉"],
  ["Hit", "/hɪt/", "verb", "Đánh", "Hit the drum.", "Hãy đánh trống.", "Hành động tay", "🥁"],
  ["Punch", "/pʌntʃ/", "verb", "Đấm", "Punch the bag.", "Đấm vào bao cát.", "Hành động tay", "🥊"],
  ["Slap", "/slæp/", "verb", "Tát", "A playful slap.", "Một cái vỗ đùa giỡn.", "Hành động tay", "✋"],
  ["Clap", "/klæp/", "verb", "Vỗ tay", "Clap your hands.", "Hãy vỗ tay nào.", "Hành động tay", "👏"],
  ["Wave", "/weɪv/", "verb", "Vẫy tay", "Wave goodbye.", "Hãy vẫy tay chào.", "Hành động tay", "👋"],
  ["Shake", "/ʃeɪk/", "verb", "Lắc/Bắt tay", "Shake hands.", "Hãy bắt tay.", "Hành động tay", "🤝"],

  // --- CHỦ ĐỀ: KÍCH THƯỚC 2 (Size & Shape) ---
  ["Huge", "/hjuːdʒ/", "adj", "Khổng lồ", "A huge elephant.", "Một con voi khổng lồ.", "Kích thước 2", "🐘"],
  ["Tiny", "/ˈtaɪ.ni/", "adj", "Bé tí", "A tiny ant.", "Một con kiến bé tí.", "Kích thước 2", "🐜"],
  ["Giant", "/ˈdʒaɪ.ənt/", "adj", "Rất lớn", "A giant tree.", "Cái cây rất lớn.", "Kích thước 2", "🌳"],
  ["Massive", "/ˈmæs.ɪv/", "adj", "Đồ sộ", "A massive rock.", "Hòn đá đồ sộ.", "Kích thước 2", "🪨"],
  ["Enormous", "/əˈnɔːr.məs/", "adj", "To lớn", "An enormous cake.", "Chiếc bánh to lớn.", "Kích thước 2", "🎂"],
  ["Broad", "/brɑːd/", "adj", "Rộng", "Broad shoulders.", "Bờ vai rộng.", "Kích thước 2", "↔️"],
  ["Narrow", "/ˈner.oʊ/", "adj", "Chật hẹp", "A narrow street.", "Con phố chật hẹp.", "Kích thước 2", "🛣️"],
  ["Deep", "/diːp/", "adj", "Sâu", "A deep river.", "Dòng sông sâu.", "Kích thước 2", "🌊"],
  ["Shallow", "/ˈʃæl.oʊ/", "adj", "Nông cạn", "The water is shallow.", "Nước rất nông.", "Kích thước 2", "💧"],
  ["Flat", "/flæt/", "adj", "Bằng phẳng", "A flat surface.", "Bề mặt bằng phẳng.", "Kích thước 2", "📏"],

  // --- CHỦ ĐỀ: MÀU SẮC 2 (Colors 2) ---
  ["Silver", "/ˈsɪl.vɚ/", "adj", "Màu bạc", "A silver coin.", "Một đồng xu bạc.", "Màu sắc 2", "🪙"],
  ["Gold", "/ɡoʊld/", "adj", "Màu vàng kim", "A gold ring.", "Một chiếc nhẫn vàng.", "Màu sắc 2", "🥇"],
  ["Bronze", "/brɑːnz/", "adj", "Màu đồng", "A bronze medal.", "Một huy chương đồng.", "Màu sắc 2", "🥉"],
  ["Copper", "/ˈkɑː.pɚ/", "adj", "Màu đồng đỏ", "A copper wire.", "Sợi dây đồng đỏ.", "Màu sắc 2", "🪢"],
  ["Cyan", "/ˈsaɪ.æn/", "adj", "Màu lục lam", "Cyan paint.", "Màu lục lam.", "Màu sắc 2", "🖌️"],
  ["Magenta", "/məˈdʒen.tə/", "adj", "Màu đỏ sẫm", "A magenta flower.", "Bông hoa đỏ sẫm.", "Màu sắc 2", "🌺"],
  ["Maroon", "/məˈruːn/", "adj", "Màu đỏ tía", "A maroon shirt.", "Chiếc áo màu đỏ tía.", "Màu sắc 2", "👕"],
  ["Navy", "/ˈneɪ.vi/", "adj", "Màu xanh hải quân", "A navy blue suit.", "Bộ com-lê xanh hải quân.", "Màu sắc 2", "🕴️"],
  ["Olive", "/ˈɑː.lɪv/", "adj", "Màu xanh ô-liu", "Olive green leaves.", "Lá cây màu xanh ô-liu.", "Màu sắc 2", "🌿"],
  ["Beige", "/beɪʒ/", "adj", "Màu be", "A beige carpet.", "Một tấm thảm màu be.", "Màu sắc 2", "🟤"],

  // --- CHỦ ĐỀ: CẢM GIÁC (Feelings & Temp) ---
  ["Hot", "/hɑːt/", "adj", "Nóng bức", "The fire is hot.", "Lửa rất nóng.", "Cảm giác", "🔥"],
  ["Cold", "/koʊld/", "adj", "Lạnh lẽo", "Ice is cold.", "Đá rất lạnh.", "Cảm giác", "🧊"],
  ["Warm", "/wɔːrm/", "adj", "Ấm áp", "A warm hug.", "Một cái ôm ấm áp.", "Cảm giác", "🤗"],
  ["Cool", "/kuːl/", "adj", "Mát mẻ", "A cool breeze.", "Một cơn gió mát mẻ.", "Cảm giác", "🌬️"],
  ["Freezing", "/ˈfriː.zɪŋ/", "adj", "Lạnh buốt", "It is freezing outside.", "Bên ngoài lạnh buốt.", "Cảm giác", "🥶"],
  ["Boiling", "/ˈbɔɪ.lɪŋ/", "adj", "Sôi sục", "Boiling water.", "Nước đang sôi sục.", "Cảm giác", "♨️"],
  ["Wet", "/wet/", "adj", "Ướt đẫm", "The dog is wet.", "Chú chó bị ướt.", "Cảm giác", "💧"],
  ["Dry", "/draɪ/", "adj", "Khô ráo", "A dry towel.", "Một cái khăn khô.", "Cảm giác", "🧖"],
  ["Damp", "/dæmp/", "adj", "Ẩm ướt", "Damp clothes.", "Quần áo ẩm ướt.", "Cảm giác", "👕"],
  ["Humid", "/ˈhjuː.mɪd/", "adj", "Ẩm thấp", "The air is humid.", "Không khí ẩm thấp.", "Cảm giác", "🥵"],

  // --- CHỦ ĐỀ: NGHỀ NGHIỆP 3 (Jobs 3) ---
  ["Actor", "/ˈæk.tɚ/", "noun", "Nam diễn viên", "He is a famous actor.", "Anh là nam diễn viên nổi tiếng.", "Nghề nghiệp 3", "🎭"],
  ["Actress", "/ˈæk.trəs/", "noun", "Nữ diễn viên", "She is a great actress.", "Cô ấy là nữ diễn viên tuyệt vời.", "Nghề nghiệp 3", "💃"],
  ["Director", "/dɪˈrek.tɚ/", "noun", "Đạo diễn", "The movie director.", "Đạo diễn phim.", "Nghề nghiệp 3", "🎬"],
  ["Producer", "/prəˈduː.sɚ/", "noun", "Nhà sản xuất", "A music producer.", "Nhà sản xuất âm nhạc.", "Nghề nghiệp 3", "🎵"],
  ["Writer", "/ˈraɪ.t̬ɚ/", "noun", "Nhà văn", "The writer writes books.", "Nhà văn viết sách.", "Nghề nghiệp 3", "📝"],
  ["Author", "/ˈɑː.θɚ/", "noun", "Tác giả", "The author of the story.", "Tác giả của câu chuyện.", "Nghề nghiệp 3", "📖"],
  ["Poet", "/ˈpoʊ.ɪt/", "noun", "Nhà thơ", "The poet writes poems.", "Nhà thơ viết các bài thơ.", "Nghề nghiệp 3", "📜"],
  ["Journalist", "/ˈdʒɝː.nə.lɪst/", "noun", "Nhà báo", "The journalist reports news.", "Nhà báo đưa tin tức.", "Nghề nghiệp 3", "📰"],
  ["Reporter", "/rɪˈpɔːr.t̬ɚ/", "noun", "Phóng viên", "A TV reporter.", "Phóng viên truyền hình.", "Nghề nghiệp 3", "🎤"],
  ["Editor", "/ˈed.ɪ.t̬ɚ/", "noun", "Biên tập viên", "The editor checks the text.", "Biên tập viên kiểm tra văn bản.", "Nghề nghiệp 3", "💻"],

  // --- CHỦ ĐỀ: THỨ TRONG TUẦN (Days of Week) ---
  ["Monday", "/ˈmʌn.deɪ/", "noun", "Thứ Hai", "Monday is the first day.", "Thứ Hai là ngày đầu tiên.", "Thứ trong tuần", "1️⃣"],
  ["Tuesday", "/ˈtuːz.deɪ/", "noun", "Thứ Ba", "I play chess on Tuesday.", "Tớ chơi cờ vào Thứ Ba.", "Thứ trong tuần", "2️⃣"],
  ["Wednesday", "/ˈwenz.deɪ/", "noun", "Thứ Tư", "Wednesday is mid-week.", "Thứ Tư là giữa tuần.", "Thứ trong tuần", "3️⃣"],
  ["Thursday", "/ˈθɝːz.deɪ/", "noun", "Thứ Năm", "We have math on Thursday.", "Chúng tớ học toán vào Thứ Năm.", "Thứ trong tuần", "4️⃣"],
  ["Friday", "/ˈfraɪ.deɪ/", "noun", "Thứ Sáu", "Friday is a happy day.", "Thứ Sáu là một ngày vui.", "Thứ trong tuần", "5️⃣"],
  ["Saturday", "/ˈsæt̬.ɚ.deɪ/", "noun", "Thứ Bảy", "No school on Saturday.", "Không đi học vào Thứ Bảy.", "Thứ trong tuần", "6️⃣"],
  ["Sunday", "/ˈsʌn.deɪ/", "noun", "Chủ Nhật", "We rest on Sunday.", "Chúng tớ nghỉ ngơi vào Chủ Nhật.", "Thứ trong tuần", "7️⃣"],
  ["Weekday", "/ˈwiːk.deɪ/", "noun", "Ngày trong tuần", "Busy weekdays.", "Những ngày trong tuần bận rộn.", "Thứ trong tuần", "📅"],
  ["Weekend", "/ˈwiːk.end/", "noun", "Cuối tuần", "Have a great weekend.", "Chúc cuối tuần vui vẻ.", "Thứ trong tuần", "🎉"],
  ["Holiday", "/ˈhɑː.lə.deɪ/", "noun", "Ngày Lễ", "Summer holiday.", "Kỳ nghỉ hè.", "Thứ trong tuần", "🏖️"],

  // --- CHỦ ĐỀ: THÁNG TRONG NĂM (Months) ---
  ["January", "/ˈdʒæn.ju.er.i/", "noun", "Tháng Một", "January is cold.", "Tháng Một rất lạnh.", "Tháng", "❄️"],
  ["February", "/ˈfeb.ru.er.i/", "noun", "Tháng Hai", "Valentine's in February.", "Ngày Valentine vào Tháng Hai.", "Tháng", "💝"],
  ["March", "/mɑːrtʃ/", "noun", "Tháng Ba", "March has breezy winds.", "Tháng Ba có gió nhẹ.", "Tháng", "🪁"],
  ["April", "/ˈeɪ.prəl/", "noun", "Tháng Tư", "April showers bring flowers.", "Mưa Tháng Tư mang lại hoa.", "Tháng", "🌧️"],
  ["May", "/meɪ/", "noun", "Tháng Năm", "May is warm.", "Tháng Năm thì ấm áp.", "Tháng", "🌸"],
  ["June", "/dʒuːn/", "noun", "Tháng Sáu", "Summer starts in June.", "Mùa hè bắt đầu vào Tháng Sáu.", "Tháng", "☀️"],
  ["July", "/dʒʊˈlaɪ/", "noun", "Tháng Bảy", "July is very hot.", "Tháng Bảy rất nóng.", "Tháng", "🥵"],
  ["August", "/ˈɑː.ɡəst/", "noun", "Tháng Tám", "We swim in August.", "Chúng tớ đi bơi vào Tháng Tám.", "Tháng", "🏊"],
  ["September", "/sepˈtem.bɚ/", "noun", "Tháng Chín", "School starts in September.", "Trường bắt đầu vào Tháng Chín.", "Tháng", "🎒"],
  ["October", "/ɑːkˈtoʊ.bɚ/", "noun", "Tháng Mười", "Halloween is in October.", "Halloween vào Tháng Mười.", "Tháng", "🎃"],

  // --- CHỦ ĐỀ: ĐỒ DÙNG CÁ NHÂN (Personal) ---
  ["Comb", "/koʊm/", "noun", "Cái lược", "I brush my hair with a comb.", "Tớ chải tóc bằng lược.", "Cá nhân", "🪮"],
  ["Wallet", "/ˈwɑː.lɪt/", "noun", "Cái ví", "He puts money in his wallet.", "Anh ấy cất tiền trong ví.", "Cá nhân", "👛"],
  ["Tissue", "/ˈtɪʃ.uː/", "noun", "Khăn giấy", "Use a tissue to wipe your face.", "Dùng khăn giấy để lau mặt.", "Cá nhân", "🤧"],
  ["Mirror", "/ˈmɪr.ɚ/", "noun", "Cái gương", "Look at yourself in the mirror.", "Hãy tự nhìn mình trong gương.", "Cá nhân", "🪞"],
  ["Perfume", "/pɝːˈfjuːm/", "noun", "Nước hoa", "She smells like perfume.", "Cô ấy có mùi nước hoa.", "Cá nhân", "🧴"],
  ["Glasses", "/ˈɡlæs.ɪz/", "noun", "Kính mắt", "He wears glasses.", "Anh ấy đeo kính.", "Cá nhân", "👓"],
  ["Watch", "/wɑːtʃ/", "noun", "Đồng hồ", "A silver watch.", "Chiếc đồng hồ bạc.", "Cá nhân", "⌚"],
  ["Key", "/kiː/", "noun", "Chìa khóa", "Lock the door with a key.", "Khóa cửa bằng chìa khóa.", "Cá nhân", "🔑"],
  ["Umbrella", "/ʌmˈbrel.ə/", "noun", "Cái ô", "Take an umbrella.", "Hãy mang theo ô.", "Cá nhân", "☂️"],
  ["Ring", "/rɪŋ/", "noun", "Chiếc nhẫn", "A gold ring.", "Chiếc nhẫn vàng.", "Cá nhân", "💍"],

  // --- CHỦ ĐỀ: CỔ TÍCH & HUYỀN THOẠI (Fairy Tales) ---
  ["King", "/kɪŋ/", "noun", "Nhà vua", "The king wears a crown.", "Nhà vua đội vương miện.", "Cổ tích", "🤴"],
  ["Queen", "/kwiːn/", "noun", "Nữ hoàng", "The queen is beautiful.", "Nữ hoàng rất xinh đẹp.", "Cổ tích", "👸"],
  ["Prince", "/prɪns/", "noun", "Hoàng tử", "The brave prince rides a horse.", "Hoàng tử dũng cảm cưỡi ngựa.", "Cổ tích", "🤴"],
  ["Princess", "/prɪnˈses/", "noun", "Công chúa", "The princess wears a pink dress.", "Công chúa mặc chiếc váy hồng.", "Cổ tích", "👸"],
  ["Dragon", "/ˈdræɡ.ən/", "noun", "Con rồng", "The dragon breathes fire.", "Con rồng phun lửa.", "Cổ tích", "🐉"],
  ["Knight", "/naɪt/", "noun", "Hiệp sĩ", "The knight holds a sword.", "Hiệp sĩ cầm một thanh kiếm.", "Cổ tích", "🤺"],
  ["Magic", "/ˈmædʒ.ɪk/", "noun", "Phép thuật", "The fairy uses magic.", "Cô tiên sử dụng phép thuật.", "Cổ tích", "✨"],
  ["Wand", "/wɑːnd/", "noun", "Đũa phép", "Wave the magic wand.", "Hãy vẫy cây đũa phép.", "Cổ tích", "🪄"],
  ["Fairy", "/ˈfer.i/", "noun", "Tiên nữ", "The fairy has wings.", "Tiên nữ có đôi cánh.", "Cổ tích", "🧚‍♀️"],
  ["Troll", "/troʊl/", "noun", "Yêu tinh", "A scary troll lives under the bridge.", "Một con yêu tinh đáng sợ sống dưới cầu.", "Cổ tích", "🧌"],

  // --- CHỦ ĐỀ: ĐỘNG VẬT RỪNG (Forest Animals) ---
  ["Mouse", "/maʊs/", "noun", "Con chuột", "The mouse eats cheese.", "Con chuột ăn phô mai.", "Thú rừng", "🐁"],
  ["Squirrel", "/ˈskwɝː.əl/", "noun", "Con sóc", "The squirrel eats nuts.", "Con sóc ăn hạt dẻ.", "Thú rừng", "🐿️"],
  ["Bat", "/bæt/", "noun", "Con dơi", "Bats fly at night.", "Dơi bay vào ban đêm.", "Thú rừng", "🦇"],
  ["Fox", "/fɑːks/", "noun", "Con cáo", "The fox is very clever.", "Con cáo rất thông minh.", "Thú rừng", "🦊"],
  ["Wolf", "/wʊlf/", "noun", "Con chó sói", "The wolf howls at the moon.", "Chó sói hú dưới ánh trăng.", "Thú rừng", "🐺"],
  ["Deer", "/dɪr/", "noun", "Con hươu", "The deer runs in the forest.", "Con hươu chạy trong rừng.", "Thú rừng", "🦌"],
  ["Moose", "/muːs/", "noun", "Nai sừng tấm", "The moose has big horns.", "Nai sừng tấm có cặp sừng lớn.", "Thú rừng", "🫎"],
  ["Boar", "/bɔːr/", "noun", "Lợn rừng", "The wild boar is dangerous.", "Lợn rừng rất nguy hiểm.", "Thú rừng", "🐗"],
  ["Raccoon", "/rækˈuːn/", "noun", "Gấu trúc Mỹ", "The raccoon washes its food.", "Gấu trúc Mỹ rửa thức ăn của nó.", "Thú rừng", "🦝"],
  ["Skunk", "/skʌŋk/", "noun", "Chồn hôi", "The skunk smells bad.", "Chồn hôi có mùi rất tệ.", "Thú rừng", "🦨"],

  // --- CHỦ ĐỀ: TRÁI CÂY 3 (Fruits 3) ---
  ["Grape", "/ɡreɪp/", "noun", "Quả nho", "I eat green grapes.", "Tớ ăn những quả nho xanh.", "Trái cây 3", "🍇"],
  ["Date", "/deɪt/", "noun", "Quả chà là", "Dates are very sticky.", "Quả chà là rất dính.", "Trái cây 3", "🌴"],
  ["Walnut", "/ˈwɑːl.nʌt/", "noun", "Hạt óc chó", "Crack the walnut open.", "Hãy đập vỡ hạt óc chó.", "Trái cây 3", "🌰"],
  ["Peanut", "/ˈpiː.nʌt/", "noun", "Đậu phộng", "Elephants like peanuts.", "Voi thích ăn đậu phộng.", "Trái cây 3", "🥜"],
  ["Almond", "/ˈɑːl.mənd/", "noun", "Hạt hạnh nhân", "I drink almond milk.", "Tớ uống sữa hạnh nhân.", "Trái cây 3", "🌰"],
  ["Chestnut", "/ˈtʃes.nʌt/", "noun", "Hạt dẻ", "Roast chestnuts on the fire.", "Nướng hạt dẻ trên lửa.", "Trái cây 3", "🌰"],
  ["Olive", "/ˈɑː.lɪv/", "noun", "Quả ô-liu", "I like olive oil.", "Tớ thích dầu ô-liu.", "Trái cây 3", "🫒"],
  ["Durian", "/ˈdʊr.i.ən/", "noun", "Sầu riêng", "Durian smells strong.", "Sầu riêng có mùi rất nồng.", "Trái cây 3", "🍈"],
  ["Lychee", "/ˈlɪtʃ.iː/", "noun", "Quả vải", "Lychee is sweet and juicy.", "Quả vải rất ngọt và mọng nước.", "Trái cây 3", "🍒"],
  ["Longan", "/ˈlɔːŋ.ɡən/", "noun", "Quả nhãn", "Longan is a small round fruit.", "Quả nhãn là trái cây nhỏ hình tròn.", "Trái cây 3", "🍈"],

  // --- CHỦ ĐỀ: PHÒNG TẮM (Bathroom) ---
  ["Shampoo", "/ʃæmˈpuː/", "noun", "Dầu gội", "Wash your hair with shampoo.", "Hãy gội đầu bằng dầu gội.", "Phòng tắm", "🧴"],
  ["Toothpaste", "/ˈtuːθ.peɪst/", "noun", "Kem đánh răng", "Put toothpaste on your brush.", "Cho kem đánh răng lên bàn chải.", "Phòng tắm", "🪥"],
  ["Sponge", "/spʌndʒ/", "noun", "Miếng bọt biển", "Wash the car with a sponge.", "Rửa xe bằng miếng bọt biển.", "Phòng tắm", "🧽"],
  ["Razor", "/ˈreɪ.zɚ/", "noun", "Dao cạo", "Dad uses a razor to shave.", "Bố dùng dao cạo để cạo râu.", "Phòng tắm", "🪒"],
  ["Lotion", "/ˈloʊ.ʃən/", "noun", "Kem dưỡng da", "Apply lotion to dry skin.", "Thoa kem dưỡng lên da khô.", "Phòng tắm", "🧴"],
  ["Towel", "/taʊəl/", "noun", "Cái khăn", "Dry your hands with a towel.", "Lau khô tay bằng khăn.", "Phòng tắm", "🧖"],
  ["Soap", "/soʊp/", "noun", "Xà phòng", "Use soap to clean.", "Dùng xà phòng để làm sạch.", "Phòng tắm", "🧼"],
  ["Bathtub", "/ˈbæθ.tʌb/", "noun", "Bồn tắm", "Relax in the bathtub.", "Thư giãn trong bồn tắm.", "Phòng tắm", "🛁"],
  ["Shower", "/ˈʃaʊ.ɚ/", "noun", "Vòi hoa sen", "Take a hot shower.", "Tắm vòi hoa sen nước nóng.", "Phòng tắm", "🚿"],
  ["Toilet", "/ˈtɔɪ.lət/", "noun", "Bồn cầu", "Flush the toilet.", "Hãy xả nước bồn cầu.", "Phòng tắm", "🚽"],

  // --- CHỦ ĐỀ: VẬT LIỆU (Materials) ---
  ["Wood", "/wʊd/", "noun", "Gỗ", "The desk is made of wood.", "Cái bàn được làm bằng gỗ.", "Vật liệu", "🪵"],
  ["Plastic", "/ˈplæs.tɪk/", "noun", "Nhựa", "Do not throw plastic in the ocean.", "Đừng vứt rác nhựa xuống đại dương.", "Vật liệu", "🪣"],
  ["Metal", "/ˈmet̬.əl/", "noun", "Kim loại", "Cars are made of metal.", "Ô tô được làm bằng kim loại.", "Vật liệu", "🪙"],
  ["Glass", "/ɡlæs/", "noun", "Thủy tinh", "The window is glass.", "Cửa sổ làm bằng thủy tinh.", "Vật liệu", "🪞"],
  ["Paper", "/ˈpeɪ.pɚ/", "noun", "Giấy", "Write on the paper.", "Hãy viết lên giấy.", "Vật liệu", "📄"],
  ["Fabric", "/ˈfæb.rɪk/", "noun", "Vải", "This fabric is very soft.", "Mảnh vải này rất mềm.", "Vật liệu", "🧵"],
  ["Leather", "/ˈleð.ɚ/", "noun", "Da", "Dad has a leather belt.", "Bố có một chiếc thắt lưng da.", "Vật liệu", "👞"],
  ["Rubber", "/ˈrʌb.ɚ/", "noun", "Cao su", "Tires are made of rubber.", "Lốp xe làm bằng cao su.", "Vật liệu", "🛞"],
  ["Cotton", "/ˈkɑː.t̬ən/", "noun", "Bông", "My shirt is cotton.", "Áo của tớ làm từ bông.", "Vật liệu", "☁️"],
  ["Wool", "/wʊl/", "noun", "Len", "Sheep give us wool.", "Cừu cho chúng ta len.", "Vật liệu", "🧶"],

  // --- CHỦ ĐỀ: TÍNH TỪ TRẠNG THÁI (States) ---
  ["Open", "/ˈoʊ.pən/", "adj", "Mở", "The door is open.", "Cửa đang mở.", "Trạng thái", "🔓"],
  ["Closed", "/kloʊzd/", "adj", "Đóng", "The shop is closed today.", "Cửa hàng đã đóng cửa hôm nay.", "Trạng thái", "🔒"],
  ["Full", "/fʊl/", "adj", "Đầy", "The glass is full of water.", "Cốc chứa đầy nước.", "Trạng thái", "🥛"],
  ["Empty", "/ˈemp.ti/", "adj", "Trống rỗng", "The box is empty.", "Cái hộp trống rỗng.", "Trạng thái", "🫙"],
  ["Clean", "/kliːn/", "adj", "Sạch sẽ", "My room is very clean.", "Phòng của tớ rất sạch sẽ.", "Trạng thái", "✨"],
  ["Dirty", "/ˈdɝː.t̬i/", "adj", "Dơ bẩn", "Wash your dirty hands.", "Hãy rửa đôi tay bẩn đi.", "Trạng thái", "💩"],
  ["New", "/nuː/", "adj", "Mới", "I have a new toy.", "Tớ có một món đồ chơi mới.", "Trạng thái", "🆕"],
  ["Old", "/oʊld/", "adj", "Cũ", "This book is very old.", "Cuốn sách này rất cũ.", "Trạng thái", "🏚️"],
  ["Broken", "/ˈbroʊ.kən/", "adj", "Vỡ, hỏng", "The toy car is broken.", "Chiếc xe đồ chơi bị hỏng rồi.", "Trạng thái", "💔"],
  ["Safe", "/seɪf/", "adj", "An toàn", "Keep your money safe.", "Hãy giữ tiền của bạn an toàn.", "Trạng thái", "🛡️"],

  // --- CHỦ ĐỀ: CÔNG TRÌNH KIẾN TRÚC (Buildings) ---
  ["Tower", "/ˈtaʊ.ɚ/", "noun", "Tòa tháp", "The Eiffel Tower is tall.", "Tháp Eiffel rất cao.", "Kiến trúc", "🗼"],
  ["Apartment", "/əˈpɑːrt.mənt/", "noun", "Căn hộ", "We live in a big apartment.", "Chúng tớ sống trong một căn hộ lớn.", "Kiến trúc", "🏢"],
  ["Cottage", "/ˈkɑː.t̬ɪdʒ/", "noun", "Nhà tranh", "A cozy cottage in the woods.", "Một ngôi nhà tranh ấm cúng trong rừng.", "Kiến trúc", "🛖"],
  ["Cabin", "/ˈkæb.ɪn/", "noun", "Nhà gỗ", "We stay in a log cabin.", "Chúng tớ ở trong một căn nhà gỗ.", "Kiến trúc", "🪵"],
  ["Hut", "/hʌt/", "noun", "Túp lều", "A small hut on the beach.", "Một túp lều nhỏ trên bãi biển.", "Kiến trúc", "⛺"],
  ["Mansion", "/ˈmæn.ʃən/", "noun", "Dinh thự", "The rich man lives in a mansion.", "Người đàn ông giàu có sống trong dinh thự.", "Kiến trúc", "🏛️"],
  ["Villa", "/ˈvɪl.ə/", "noun", "Biệt thự", "A beautiful holiday villa.", "Một căn biệt thự nghỉ dưỡng xinh đẹp.", "Kiến trúc", "🏡"],
  ["Stadium", "/ˈsteɪ.di.əm/", "noun", "Sân vận động", "The football match is at the stadium.", "Trận bóng đá diễn ra ở sân vận động.", "Kiến trúc", "🏟️"],
  ["Museum", "/mjuːˈziː.əm/", "noun", "Bảo tàng", "We see dinosaur bones at the museum.", "Chúng tớ xem xương khủng long ở bảo tàng.", "Kiến trúc", "🏛️"],
  ["Castle", "/ˈkæs.əl/", "noun", "Lâu đài", "The king's castle is huge.", "Lâu đài của nhà vua rất khổng lồ.", "Kiến trúc", "🏰"],

  // --- CHỦ ĐỀ: LOÀI CHIM 2 (Birds 2) ---
  ["Pigeon", "/ˈpɪdʒ.ən/", "noun", "Chim bồ câu", "Pigeons eat breadcrumbs.", "Chim bồ câu ăn mẩu bánh mì.", "Loài chim", "🐦"],
  ["Robin", "/ˈrɑː.bɪn/", "noun", "Chim cổ đỏ", "The robin has a red chest.", "Chim cổ đỏ có ngực màu đỏ.", "Loài chim", "🪶"],
  ["Sparrow", "/ˈsper.oʊ/", "noun", "Chim sẻ", "A tiny sparrow is on the branch.", "Một chú chim sẻ nhỏ đậu trên cành.", "Loài chim", "🐤"],
  ["Woodpecker", "/ˈwʊdˌpek.ɚ/", "noun", "Chim gõ kiến", "The woodpecker taps the tree.", "Chim gõ kiến gõ vào thân cây.", "Loài chim", "🪵"],
  ["Pelican", "/ˈpel.ə.kən/", "noun", "Chim bồ nông", "Pelicans eat fish.", "Chim bồ nông ăn cá.", "Loài chim", "🦤"],
  ["Seagull", "/ˈsiː.ɡʌl/", "noun", "Mòng biển", "Seagulls fly over the sea.", "Mòng biển bay lượn trên biển.", "Loài chim", "🌊"],
  ["Owl", "/aʊl/", "noun", "Con cú", "The owl hoots at night.", "Con cú kêu vào ban đêm.", "Loài chim", "🦉"],
  ["Eagle", "/ˈiː.ɡəl/", "noun", "Đại bàng", "The eagle has sharp eyes.", "Đại bàng có đôi mắt sắc bén.", "Loài chim", "🦅"],
  ["Swan", "/swɑːn/", "noun", "Thiên nga", "A beautiful white swan.", "Một chú thiên nga trắng xinh đẹp.", "Loài chim", "🦢"],
  ["Flamingo", "/fləˈmɪŋ.ɡoʊ/", "noun", "Hồng hạc", "Flamingos are pink birds.", "Hồng hạc là loài chim màu hồng.", "Loài chim", "🦩"],

  // --- CHỦ ĐỀ: GIÁC QUAN (Senses) ---
  ["See", "/siː/", "verb", "Nhìn thấy", "I can see a bird.", "Tớ có thể nhìn thấy một con chim.", "Giác quan", "👁️"],
  ["Watch", "/wɑːtʃ/", "verb", "Xem, theo dõi", "We watch a movie together.", "Chúng tớ cùng nhau xem phim.", "Giác quan", "📺"],
  ["Hear", "/hɪr/", "verb", "Nghe thấy", "Did you hear that sound?", "Bạn có nghe thấy âm thanh đó không?", "Giác quan", "👂"],
  ["Listen", "/ˈlɪs.ən/", "verb", "Lắng nghe", "Listen to your teacher.", "Hãy lắng nghe giáo viên của bạn.", "Giác quan", "🎧"],
  ["Smell", "/smel/", "verb", "Ngửi", "Smell this beautiful flower.", "Hãy ngửi bông hoa xinh đẹp này.", "Giác quan", "👃"],
  ["Sniff", "/snɪf/", "verb", "Đánh hơi", "The dog sniffs the ground.", "Con chó đánh hơi mặt đất.", "Giác quan", "🐕"],
  ["Taste", "/teɪst/", "verb", "Nếm", "Taste this delicious cake.", "Hãy nếm thử chiếc bánh ngon này.", "Giác quan", "👅"],
  ["Touch", "/tʌtʃ/", "verb", "Chạm vào", "Do not touch the hot stove.", "Đừng chạm vào bếp nóng.", "Giác quan", "👆"],
  ["Feel", "/fiːl/", "verb", "Cảm thấy", "I feel happy today.", "Hôm nay tớ cảm thấy vui.", "Giác quan", "❤️"],
  ["Look", "/lʊk/", "verb", "Nhìn, ngắm", "Look at the stars.", "Hãy ngắm nhìn những vì sao.", "Giác quan", "👀"],

  // --- CHỦ ĐỀ: CƠ THỂ 2 (Body Parts 2) ---
  ["Shoulder", "/ˈʃoʊl.dɚ/", "noun", "Bờ vai", "I carry my bag on my shoulder.", "Tớ đeo cặp trên vai.", "Cơ thể 2", "🧍"],
  ["Arm", "/ɑːrm/", "noun", "Cánh tay", "My arms are strong.", "Cánh tay của tớ rất khỏe.", "Cơ thể 2", "💪"],
  ["Elbow", "/ˈel.boʊ/", "noun", "Khuỷu tay", "I bumped my elbow.", "Tớ bị cộc khuỷu tay.", "Cơ thể 2", "🦾"],
  ["Wrist", "/rɪst/", "noun", "Cổ tay", "I wear a watch on my wrist.", "Tớ đeo đồng hồ ở cổ tay.", "Cơ thể 2", "⌚"],
  ["Leg", "/leɡ/", "noun", "Cẳng chân", "I run with my legs.", "Tớ chạy bằng đôi chân.", "Cơ thể 2", "🦵"],
  ["Knee", "/niː/", "noun", "Đầu gối", "Bend your knees.", "Hãy gập đầu gối xuống.", "Cơ thể 2", "🧎"],
  ["Ankle", "/ˈæŋ.kəl/", "noun", "Mắt cá chân", "I hurt my ankle.", "Tớ bị đau mắt cá chân.", "Cơ thể 2", "🦶"],
  ["Heel", "/hiːl/", "noun", "Gót chân", "My heel is rubbing my shoe.", "Gót chân tớ cọ vào giày.", "Cơ thể 2", "👠"],
  ["Toe", "/toʊ/", "noun", "Ngón chân", "Wiggle your toes.", "Hãy ngọ nguậy các ngón chân đi.", "Cơ thể 2", "🦶"],
  ["Thumb", "/θʌm/", "noun", "Ngón tay cái", "Give me a thumbs up!", "Hãy giơ ngón tay cái lên!", "Cơ thể 2", "👍"],

  // --- CHỦ ĐỀ: THẢM HỌA THIÊN NHIÊN (Disasters) ---
  ["Earthquake", "/ˈɝːθ.kweɪk/", "noun", "Động đất", "The ground shakes in an earthquake.", "Mặt đất rung chuyển khi có động đất.", "Thảm họa", "🫨"],
  ["Flood", "/flʌd/", "noun", "Lũ lụt", "The heavy rain caused a flood.", "Mưa lớn gây ra lũ lụt.", "Thảm họa", "🌊"],
  ["Tsunami", "/tsuːˈnɑː.mi/", "noun", "Sóng thần", "A tsunami is a giant wave.", "Sóng thần là một cơn sóng khổng lồ.", "Thảm họa", "🌊"],
  ["Drought", "/draʊt/", "noun", "Hạn hán", "Plants die during a drought.", "Cây cối chết trong thời kỳ hạn hán.", "Thảm họa", "🏜️"],
  ["Landslide", "/ˈlænd.slaɪd/", "noun", "Sạt lở đất", "Rocks fall in a landslide.", "Đá rơi xuống trong vụ sạt lở đất.", "Thảm họa", "🪨"],
  ["Eruption", "/ɪˈrʌp.ʃən/", "noun", "Sự phun trào", "The volcano's eruption was loud.", "Sự phun trào của núi lửa rất ồn.", "Thảm họa", "🌋"],
  ["Wildfire", "/ˈwaɪld.faɪr/", "noun", "Cháy rừng", "Animals run away from the wildfire.", "Động vật chạy trốn khỏi đám cháy rừng.", "Thảm họa", "🔥"],
  ["Blizzard", "/ˈblɪz.ɚd/", "noun", "Bão tuyết", "It is freezing in a blizzard.", "Trời lạnh cóng trong trận bão tuyết.", "Thảm họa", "🌨️"],
  ["Typhoon", "/taɪˈfuːn/", "noun", "Bão nhiệt đới", "The typhoon brings strong winds.", "Bão nhiệt đới mang theo gió mạnh.", "Thảm họa", "🌀"],
  ["Storm", "/stɔːrm/", "noun", "Cơn bão", "Stay inside during the storm.", "Hãy ở trong nhà khi có bão.", "Thảm họa", "⛈️"],

  // --- CHỦ ĐỀ: Y TẾ & CHĂM SÓC (Medical) ---
  ["Patient", "/ˈpeɪ.ʃənt/", "noun", "Bệnh nhân", "The patient rests in bed.", "Bệnh nhân nghỉ ngơi trên giường.", "Y tế", "🤕"],
  ["Pill", "/pɪl/", "noun", "Viên thuốc", "Swallow the pill with water.", "Hãy uống viên thuốc cùng với nước.", "Y tế", "💊"],
  ["Injection", "/ɪnˈdʒek.ʃən/", "noun", "Mũi tiêm", "The injection doesn't hurt much.", "Mũi tiêm không đau lắm đâu.", "Y tế", "💉"],
  ["Syringe", "/sɪˈrɪndʒ/", "noun", "Ống tiêm", "The nurse uses a syringe.", "Y tá dùng một ống tiêm.", "Y tế", "💉"],
  ["Thermometer", "/θɚˈmɑː.mə.t̬ɚ/", "noun", "Nhiệt kế", "Check your fever with a thermometer.", "Kiểm tra cơn sốt bằng nhiệt kế.", "Y tế", "🌡️"],
  ["X-ray", "/ˈeks.reɪ/", "noun", "Chụp X-quang", "The X-ray shows your bones.", "Hình X-quang cho thấy xương của bạn.", "Y tế", "🩻"],
  ["Wheelchair", "/ˈwiːl.tʃer/", "noun", "Xe lăn", "He sits in a wheelchair.", "Anh ấy ngồi xe lăn.", "Y tế", "🦽"],
  ["Band-aid", "/ˈbænd.eɪd/", "noun", "Băng cá nhân", "Put a band-aid on your cut.", "Dán băng cá nhân vào vết đứt tay.", "Y tế", "🩹"],
  ["Plaster", "/ˈplæs.tɚ/", "noun", "Bó bột", "He has a plaster on his arm.", "Anh ấy phải bó bột ở cánh tay.", "Y tế", "🦾"],
  ["Mask", "/mæsk/", "noun", "Khẩu trang", "Wear a mask to stay safe.", "Đeo khẩu trang để giữ an toàn.", "Y tế", "😷"],

  // --- CHỦ ĐỀ: BÁNH KẸO (Candy & Sweets) ---
  ["Candy", "/ˈkæn.di/", "noun", "Kẹo", "Eating too much candy is bad.", "Ăn quá nhiều kẹo không tốt.", "Bánh kẹo", "🍬"],
  ["Gum", "/ɡʌm/", "noun", "Kẹo cao su", "Chew gum but don't swallow it.", "Nhai kẹo cao su nhưng đừng nuốt nhé.", "Bánh kẹo", "🫧"],
  ["Lollipop", "/ˈlɑː.li.pɑːp/", "noun", "Kẹo mút", "A colorful lollipop.", "Một chiếc kẹo mút đầy màu sắc.", "Bánh kẹo", "🍭"],
  ["Marshmallow", "/ˈmɑːrʃˌmæl.oʊ/", "noun", "Kẹo dẻo", "Roast marshmallows on the fire.", "Nướng kẹo dẻo trên lửa.", "Bánh kẹo", "🍡"],
  ["Nougat", "/ˈnuː.ɡət/", "noun", "Kẹo hạt hạnh nhân", "Soft and chewy nougat.", "Kẹo nougat mềm và dai.", "Bánh kẹo", "🍬"],
  ["Toffee", "/ˈtɑː.fi/", "noun", "Kẹo bơ cứng", "Crunchy caramel toffee.", "Kẹo bơ cứng giòn tan.", "Bánh kẹo", "🍬"],
  ["Caramel", "/ˈker.ə.məl/", "noun", "Đường caramel", "Caramel sauce on ice cream.", "Xốt caramel rưới trên kem.", "Bánh kẹo", "🍮"],
  ["Cookie", "/ˈkʊk.i/", "noun", "Bánh quy", "I eat a sweet cookie.", "Tớ ăn một chiếc bánh quy ngọt.", "Bánh kẹo", "🍪"],
  ["Pudding", "/ˈpʊd.ɪŋ/", "noun", "Bánh pudding", "Chocolate pudding is soft.", "Bánh pudding sô-cô-la rất mềm.", "Bánh kẹo", "🍮"],
  ["Donut", "/ˈdoʊ.nʌt/", "noun", "Bánh vòng donut", "A donut with sprinkles.", "Một chiếc bánh vòng rắc hạt đường.", "Bánh kẹo", "🍩"],

  // --- CHỦ ĐỀ: GIAO THÔNG ĐƯỜNG THỦY & BAY (Water & Air Transport) ---
  ["Submarine", "/ˌsʌb.məˈriːn/", "noun", "Tàu ngầm", "The submarine goes deep underwater.", "Tàu ngầm lặn sâu dưới nước.", "Đường thủy bay", "🛶"],
  ["Hovercraft", "/ˈhʌv.ɚ.kræft/", "noun", "Tàu đệm khí", "A hovercraft floats above water.", "Tàu đệm khí trượt trên mặt nước.", "Đường thủy bay", "🛥️"],
  ["Yacht", "/jɑːt/", "noun", "Du thuyền", "A party on a luxury yacht.", "Một bữa tiệc trên du thuyền sang trọng.", "Đường thủy bay", "🛥️"],
  ["Raft", "/ræft/", "noun", "Cái bè", "We float down the river on a raft.", "Chúng tớ trôi dọc sông trên một chiếc bè.", "Đường thủy bay", "🪵"],
  ["Canoe", "/kəˈnuː/", "noun", "Thuyền ca-nô", "Paddle the canoe.", "Hãy chèo thuyền ca-nô.", "Đường thủy bay", "🛶"],
  ["Kayak", "/ˈkaɪ.æk/", "noun", "Thuyền kayak", "Kayaking is a fun sport.", "Chèo kayak là một môn thể thao vui.", "Đường thủy bay", "🛶"],
  ["Gondola", "/ˈɡɑːn.də.lə/", "noun", "Thuyền đáy bằng", "Ride a gondola in Venice.", "Đi thuyền gondola ở Venice.", "Đường thủy bay", "🛶"],
  ["Glider", "/ˈɡlaɪ.dɚ/", "noun", "Tàu lượn", "The glider flies silently.", "Tàu lượn bay không phát ra tiếng động.", "Đường thủy bay", "🛩️"],
  ["Blimp", "/blɪmp/", "noun", "Khí cầu", "A blimp flies slowly in the sky.", "Một chiếc khí cầu bay chầm chậm trên trời.", "Đường thủy bay", "🎈"],
  ["Jet", "/dʒet/", "noun", "Máy bay phản lực", "The jet is very fast.", "Máy bay phản lực bay rất nhanh.", "Đường thủy bay", "🛩️"],

  // --- CHỦ ĐỀ: TÍNH CÁCH 2 (Personality 2) ---
  ["Shy", "/ʃaɪ/", "adj", "Nhút nhát", "The shy boy hides behind his mom.", "Cậu bé nhút nhát trốn sau lưng mẹ.", "Tính cách 2", "🫣"],
  ["Proud", "/praʊd/", "adj", "Tự hào", "I am proud of my good grades.", "Tớ tự hào vì điểm tốt của mình.", "Tính cách 2", "😤"],
  ["Honest", "/ˈɑː.nɪst/", "adj", "Trung thực", "An honest person tells the truth.", "Người trung thực luôn nói thật.", "Tính cách 2", "😇"],
  ["Greedy", "/ˈɡriː.di/", "adj", "Tham lam", "The greedy dog wants all the bones.", "Chú chó tham lam muốn tất cả cục xương.", "Tính cách 2", "🤤"],
  ["Selfish", "/ˈsel.fɪʃ/", "adj", "Ích kỷ", "Don't be selfish, share your toys.", "Đừng ích kỷ, hãy chia sẻ đồ chơi.", "Tính cách 2", "😒"],
  ["Generous", "/ˈdʒen.ɚ.əs/", "adj", "Rộng lượng", "He is generous to his friends.", "Anh ấy hào phóng với bạn bè.", "Tính cách 2", "🤝"],
  ["Loyal", "/ˈlɔɪ.əl/", "adj", "Trung thành", "Dogs are loyal animals.", "Chó là loài vật trung thành.", "Tính cách 2", "🐕"],
  ["Jealous", "/ˈdʒel.əs/", "adj", "Ghen tị", "She is jealous of my new bike.", "Cô ấy ghen tị với chiếc xe đạp mới của tớ.", "Tính cách 2", "😒"],
  ["Friendly", "/ˈfrend.li/", "adj", "Thân thiện", "He gives a friendly smile.", "Cậu bé nở nụ cười thân thiện.", "Tính cách 2", "👋"],
  ["Mean", "/miːn/", "adj", "Xấu tính", "It is not nice to be mean.", "Trở nên xấu tính thì không hay đâu.", "Tính cách 2", "😠"],

  // --- CHỦ ĐỀ: HỌ HÀNG MỞ RỘNG (Extended Family) ---
  ["Cousin", "/ˈkʌz.ən/", "noun", "Anh/chị em họ", "I play with my cousin.", "Tớ chơi với anh họ.", "Họ hàng", "🧒"],
  ["Nephew", "/ˈnef.juː/", "noun", "Cháu trai", "My nephew is a cute baby.", "Cháu trai của tớ là một em bé dễ thương.", "Họ hàng", "👶"],
  ["Niece", "/niːs/", "noun", "Cháu gái", "I buy a gift for my niece.", "Tớ mua quà cho cháu gái.", "Họ hàng", "👧"],
  ["Grandson", "/ˈɡræn.sʌn/", "noun", "Cháu trai (của ông bà)", "The grandfather loves his grandson.", "Ông rất thương cháu trai của mình.", "Họ hàng", "👦"],
  ["Granddaughter", "/ˈɡræn.dɑː.t̬ɚ/", "noun", "Cháu gái (của ông bà)", "She is a sweet granddaughter.", "Cô bé là đứa cháu gái ngoan ngoãn.", "Họ hàng", "👧"],
  ["Parent", "/ˈper.ənt/", "noun", "Phụ huynh", "Listen to your parents.", "Hãy vâng lời bố mẹ bạn.", "Họ hàng", "👩‍❤️‍👨"],
  ["Child", "/tʃaɪld/", "noun", "Đứa trẻ", "The child plays with toys.", "Đứa trẻ chơi với đồ chơi.", "Họ hàng", "🧒"],
  ["Friend", "/frend/", "noun", "Bạn bè", "You are my best friend.", "Bạn là người bạn tốt nhất của tớ.", "Họ hàng", "🫂"],
  ["Neighbor", "/ˈneɪ.bɚ/", "noun", "Hàng xóm", "Our neighbor is very kind.", "Hàng xóm của chúng tớ rất tốt bụng.", "Họ hàng", "🏡"],
  ["Guest", "/ɡest/", "noun", "Vị khách", "We have a guest for dinner.", "Chúng tớ có khách đến ăn tối.", "Họ hàng", "🍽️"],

  // --- CHỦ ĐỀ: TỪ ĐỂ HỎI & ĐẠI TỪ (Wh-words & Pronouns) ---
  ["Who", "/huː/", "pronoun", "Ai", "Who is that man?", "Người đàn ông kia là ai?", "Đại từ", "❓"],
  ["What", "/hwɑːt/", "pronoun", "Cái gì", "What is your name?", "Tên của bạn là gì?", "Đại từ", "❓"],
  ["Where", "/hwer/", "pronoun", "Ở đâu", "Where is the book?", "Quyển sách ở đâu?", "Đại từ", "📍"],
  ["When", "/hwen/", "pronoun", "Khi nào", "When does school start?", "Khi nào trường học bắt đầu?", "Đại từ", "⏰"],
  ["Why", "/hwaɪ/", "pronoun", "Tại sao", "Why are you crying?", "Tại sao bạn khóc?", "Đại từ", "🤷"],
  ["How", "/haʊ/", "pronoun", "Như thế nào", "How are you today?", "Hôm nay bạn thế nào?", "Đại từ", "🤔"],
  ["Which", "/hwɪtʃ/", "pronoun", "Cái nào", "Which color do you like?", "Bạn thích màu nào hơn?", "Đại từ", "👉"],
  ["Whose", "/huːz/", "pronoun", "Của ai", "Whose bag is this?", "Chiếc cặp này là của ai?", "Đại từ", "🎒"],
  ["This", "/ðɪs/", "pronoun", "Cái này", "This is my pencil.", "Đây là bút chì của tớ.", "Đại từ", "👇"],
  ["That", "/ðæt/", "pronoun", "Cái kia", "That is a tall tree.", "Đó là một cái cây cao.", "Đại từ", "👆"],

  // --- CHỦ ĐỀ: NGHỆ THUẬT & SỞ THÍCH (Arts & Hobbies) ---
  ["Paint", "/peɪnt/", "verb", "Tô màu", "I paint a colorful picture.", "Tớ tô màu một bức tranh sặc sỡ.", "Nghệ thuật", "🎨"],
  ["Draw", "/drɑː/", "verb", "Vẽ phác họa", "Draw a circle.", "Hãy vẽ một hình tròn.", "Nghệ thuật", "✏️"],
  ["Sing", "/sɪŋ/", "verb", "Ca hát", "Let's sing a happy song.", "Hãy cùng hát một bài vui nhộn.", "Nghệ thuật", "🎤"],
  ["Dance", "/dæns/", "verb", "Khiêu vũ", "They dance to the music.", "Họ nhảy theo điệu nhạc.", "Nghệ thuật", "💃"],
  ["Read", "/riːd/", "verb", "Đọc sách", "I love to read storybooks.", "Tớ rất thích đọc truyện.", "Nghệ thuật", "📖"],
  ["Write", "/raɪt/", "verb", "Viết chữ", "Write your name here.", "Hãy viết tên của bạn vào đây.", "Nghệ thuật", "✍️"],
  ["Act", "/ækt/", "verb", "Diễn xuất", "He acts in a play.", "Cậu ấy diễn xuất trong một vở kịch.", "Nghệ thuật", "🎭"],
  ["Sculpt", "/skʌlpt/", "verb", "Điêu khắc", "Sculpt a bear out of clay.", "Nặn hình con gấu bằng đất sét.", "Nghệ thuật", "🗿"],
  ["Knit", "/nɪt/", "verb", "Đan len", "Grandma knits a sweater.", "Bà ngoại đang đan áo len.", "Nghệ thuật", "🧶"],
  ["Sew", "/soʊ/", "verb", "Khâu vá", "Sew a button on the shirt.", "Khâu một chiếc cúc lên áo.", "Nghệ thuật", "🪡"],

  // --- CHỦ ĐỀ: NHẠC CỤ 2 (Instruments 2) ---
  ["Cello", "/ˈtʃel.oʊ/", "noun", "Đàn cello", "The cello is bigger than a violin.", "Đàn cello to hơn đàn violin.", "Nhạc cụ 2", "🎻"],
  ["Harp", "/hɑːrp/", "noun", "Đàn hạc", "Angels play the harp.", "Các thiên thần chơi đàn hạc.", "Nhạc cụ 2", "🪕"],
  ["Banjo", "/ˈbæn.dʒoʊ/", "noun", "Đàn banjo", "He plucks the banjo strings.", "Ông ấy gảy dây đàn banjo.", "Nhạc cụ 2", "🪕"],
  ["Ukulele", "/ˌjuː.kəˈleɪ.li/", "noun", "Đàn ukulele", "The ukulele sounds happy.", "Tiếng đàn ukulele nghe rất vui tai.", "Nhạc cụ 2", "🎸"],
  ["Accordion", "/əˈkɔːr.di.ən/", "noun", "Đàn phong cầm", "Pull and push the accordion.", "Kéo và đẩy đàn phong cầm.", "Nhạc cụ 2", "🪗"],
  ["Harmonica", "/hɑːrˈmɑː.nɪ.kə/", "noun", "Kèn ác-mô-ni-ca", "Blow into the harmonica.", "Hãy thổi kèn harmonica.", "Nhạc cụ 2", "🌬️"],
  ["Clarinet", "/ˌkler.əˈnet/", "noun", "Kèn clarinet", "She plays the clarinet.", "Cô ấy chơi kèn clarinet.", "Nhạc cụ 2", "🪈"],
  ["Oboe", "/ˈoʊ.boʊ/", "noun", "Kèn ô-boa", "The oboe is a woodwind instrument.", "Kèn ô-boa là nhạc cụ bằng gỗ.", "Nhạc cụ 2", "🪈"],
  ["Tuba", "/ˈtuː.bə/", "noun", "Kèn tu-ba", "The tuba makes a deep sound.", "Kèn tu-ba tạo ra âm thanh trầm.", "Nhạc cụ 2", "🎺"],
  ["Xylophone", "/ˈzaɪ.lə.foʊn/", "noun", "Đàn phiến gỗ", "Hit the xylophone with sticks.", "Gõ đàn phiến gỗ bằng dùi.", "Nhạc cụ 2", "🎹"],

  // --- CHỦ ĐỀ: ĐỘNG TỪ HỌC TẬP (Study Verbs) ---
  ["Learn", "/lɝːn/", "verb", "Học hỏi", "We learn new words.", "Chúng tớ học các từ mới.", "Học tập 2", "🧠"],
  ["Study", "/ˈstʌd.i/", "verb", "Ôn bài", "Study for the math test.", "Hãy ôn tập cho bài kiểm tra toán.", "Học tập 2", "📚"],
  ["Spell", "/spel/", "verb", "Đánh vần", "How do you spell your name?", "Bạn đánh vần tên bạn thế nào?", "Học tập 2", "🔤"],
  ["Count", "/kaʊnt/", "verb", "Đếm số", "Count from one to ten.", "Hãy đếm từ một đến mười.", "Học tập 2", "🔢"],
  ["Think", "/θɪŋk/", "verb", "Suy nghĩ", "Think before you speak.", "Hãy suy nghĩ trước khi nói.", "Học tập 2", "🤔"],
  ["Understand", "/ˌʌn.dɚˈstænd/", "verb", "Thấu hiểu", "I understand the lesson.", "Tớ đã hiểu bài học.", "Học tập 2", "💡"],
  ["Remember", "/rɪˈmem.bɚ/", "verb", "Ghi nhớ", "Remember to bring your book.", "Nhớ mang theo sách nhé.", "Học tập 2", "🧠"],
  ["Forget", "/fɚˈɡet/", "verb", "Quên mất", "Don't forget your homework.", "Đừng quên bài tập về nhà của bạn.", "Học tập 2", "🤦"],
  ["Ask", "/æsk/", "verb", "Đặt câu hỏi", "Raise your hand to ask.", "Giơ tay lên để đặt câu hỏi.", "Học tập 2", "🙋"],
  ["Answer", "/ˈæn.sɚ/", "verb", "Trả lời", "Answer the teacher's question.", "Trả lời câu hỏi của giáo viên.", "Học tập 2", "🙋"],

  // --- CHỦ ĐỀ: ĐỘNG TỪ VẬN ĐỘNG 2 (Movement 2) ---
  ["Walk", "/wɑːk/", "verb", "Đi bộ", "I walk to school.", "Tớ đi bộ đến trường.", "Vận động", "🚶"],
  ["Run", "/rʌn/", "verb", "Chạy", "Run as fast as you can.", "Hãy chạy nhanh nhất có thể.", "Vận động", "🏃‍♂️"],
  ["Jump", "/dʒʌmp/", "verb", "Nhảy lên", "Frogs can jump high.", "Ếch có thể nhảy cao.", "Vận động", "🐸"],
  ["Hop", "/hɑːp/", "verb", "Nhảy lò cò", "Bunnies hop on the grass.", "Thỏ nhảy lò cò trên bãi cỏ.", "Vận động", "🐇"],
  ["Skip", "/skɪp/", "verb", "Nhảy chân sáo", "The girl skips rope.", "Cô bé nhảy chân sáo đùa vui.", "Vận động", "👧"],
  ["Crawl", "/krɑːl/", "verb", "Bò, trườn", "The baby learns to crawl.", "Em bé tập bò.", "Vận động", "👶"],
  ["Creep", "/kriːp/", "verb", "Đi rón rén", "The cat creeps quietly.", "Con mèo đi rón rén im lặng.", "Vận động", "🐈"],
  ["March", "/mɑːrtʃ/", "verb", "Hành quân", "The soldiers march together.", "Các quân lính cùng nhau hành quân.", "Vận động", "💂"],
  ["Stroll", "/stroʊl/", "verb", "Đi dạo", "Take a stroll in the park.", "Đi dạo trong công viên.", "Vận động", "🚶‍♀️"],
  ["Sprint", "/sprɪnt/", "verb", "Chạy nước rút", "Sprint to the finish line.", "Chạy nước rút đến vạch đích.", "Vận động", "🏃"],

  // --- CHỦ ĐỀ: KHÔNG GIAN VÀ VŨ TRỤ 2 (Space 2) ---
  ["Orbit", "/ˈɔːr.bɪt/", "noun", "Quỹ đạo", "Earth is in orbit.", "Trái Đất di chuyển theo quỹ đạo.", "Vũ trụ 2", "🌍"],
  ["Gravity", "/ˈɡræv.ə.t̬i/", "noun", "Trọng lực", "Gravity keeps us on the ground.", "Trọng lực giữ chúng ta trên mặt đất.", "Vũ trụ 2", "🍎"],
  ["Asteroid", "/ˈæs.tə.rɔɪd/", "noun", "Tiểu hành tinh", "An asteroid is a space rock.", "Tiểu hành tinh là tảng đá không gian.", "Vũ trụ 2", "🪨"],
  ["Meteor", "/ˈmiː.t̬i.ɔːr/", "noun", "Sao băng", "Make a wish on a meteor.", "Hãy ước một điều với sao băng.", "Vũ trụ 2", "🌠"],
  ["Nebula", "/ˈneb.jə.lə/", "noun", "Tinh vân", "A nebula is a colorful space cloud.", "Tinh vân là một đám mây vũ trụ rực rỡ.", "Vũ trụ 2", "🌌"],
  ["Satellite", "/ˈsæt̬.əl.aɪt/", "noun", "Vệ tinh", "The satellite takes pictures.", "Vệ tinh nhân tạo dùng để chụp ảnh.", "Vũ trụ 2", "🛰️"],
  ["Spacecraft", "/ˈspeɪs.kræft/", "noun", "Tàu vũ trụ", "The spacecraft lands on Mars.", "Tàu vũ trụ hạ cánh xuống sao Hỏa.", "Vũ trụ 2", "🛸"],
  ["Planetarium", "/ˌplæn.ɪˈter.i.əm/", "noun", "Cung thiên văn", "Learn about stars at the planetarium.", "Tìm hiểu về các vì sao tại cung thiên văn.", "Vũ trụ 2", "🔭"],
  ["Eclipse", "/ɪˈklɪps/", "noun", "Nhật/Nguyệt thực", "The moon causes a solar eclipse.", "Mặt trăng gây ra hiện tượng nhật thực.", "Vũ trụ 2", "🌒"],
  ["Supernova", "/ˌsuː.pɚˈnoʊ.və/", "noun", "Siêu tân tinh", "A supernova is a star explosion.", "Siêu tân tinh là vụ nổ của một vì sao.", "Vũ trụ 2", "💥"],

  // --- CHỦ ĐỀ: TOÁN HỌC & HÌNH HỌC (Math) ---
  ["Plus", "/plʌs/", "noun", "Cộng", "One plus one is two.", "Một cộng một bằng hai.", "Toán học", "➕"],
  ["Minus", "/ˈmaɪ.nəs/", "noun", "Trừ", "Three minus one is two.", "Ba trừ một bằng hai.", "Toán học", "➖"],
  ["Multiply", "/ˈmʌl.tə.plaɪ/", "verb", "Nhân", "Multiply two by three.", "Nhân hai với ba.", "Toán học", "✖️"],
  ["Divide", "/dɪˈvaɪd/", "verb", "Chia", "Divide the cake into four.", "Chia chiếc bánh ra làm bốn.", "Toán học", "➗"],
  ["Equal", "/ˈiː.kwəl/", "adj", "Bằng nhau", "Two plus two equals four.", "Hai cộng hai bằng bốn.", "Toán học", "🟰"],
  ["Half", "/hæf/", "noun", "Một nửa", "Cut the apple in half.", "Hãy cắt quả táo ra làm nửa.", "Toán học", "🌗"],
  ["Quarter", "/ˈkwɔːr.t̬ɚ/", "noun", "Một phần tư", "A quarter of a pizza.", "Một phần tư chiếc bánh pizza.", "Toán học", "🍕"],
  ["Line", "/laɪn/", "noun", "Đường thẳng", "Draw a straight line.", "Hãy vẽ một đường thẳng.", "Toán học", "📏"],
  ["Angle", "/ˈæŋ.ɡəl/", "noun", "Góc độ", "A triangle has three angles.", "Hình tam giác có ba góc.", "Toán học", "📐"],
  ["Point", "/pɔɪnt/", "noun", "Dấu chấm", "Draw a point on the paper.", "Vẽ một chấm nhỏ trên giấy.", "Toán học", "📍"],

  // --- CHỦ ĐỀ: CẢNH QUAN THIÊN NHIÊN (Landscapes) ---
  ["Valley", "/ˈvæl.i/", "noun", "Thung lũng", "A green valley.", "Một thung lũng xanh mướt.", "Cảnh quan", "🏞️"],
  ["Cliff", "/klɪf/", "noun", "Vách đá", "Don't fall off the cliff.", "Đừng rơi xuống vách đá nhé.", "Cảnh quan", "⛰️"],
  ["Waterfall", "/ˈwɑː.t̬ɚ.fɑːl/", "noun", "Thác nước", "The waterfall is loud.", "Thác nước chảy rất ồn ào.", "Cảnh quan", "🌊"],
  ["Stream", "/striːm/", "noun", "Dòng suối", "A small stream.", "Một dòng suối nhỏ.", "Cảnh quan", "🏞️"],
  ["Pond", "/pɑːnd/", "noun", "Cái ao", "Frogs live in the pond.", "Ếch sống trong ao.", "Cảnh quan", "🦆"],
  ["Swamp", "/swɑːmp/", "noun", "Đầm lầy", "Crocodiles swim in the swamp.", "Cá sấu bơi trong đầm lầy.", "Cảnh quan", "🐊"],
  ["Oasis", "/oʊˈeɪ.sɪs/", "noun", "Ốc đảo", "An oasis in the desert.", "Một ốc đảo trên sa mạc.", "Cảnh quan", "🌴"],
  ["Glacier", "/ˈɡleɪ.ʃɚ/", "noun", "Sông băng", "The glacier is melting.", "Sông băng đang tan chảy.", "Cảnh quan", "🧊"],
  ["Volcano", "/vɑːlˈkeɪ.noʊ/", "noun", "Núi lửa", "The volcano is hot.", "Núi lửa rất nóng.", "Cảnh quan", "🌋"],
  ["Island", "/ˈaɪ.lənd/", "noun", "Hòn đảo", "An island in the sea.", "Một hòn đảo trên biển.", "Cảnh quan", "🏝️"]
];

// Map RAW_DATA thành mảng Object có cấu trúc
const VOCABULARY_DATA = RAW_DATA.filter(item => Array.isArray(item) && item.length >= 8).map((item, index) => ({
  id: index + 1,
  word: item[0],
  phonetic: item[1],
  type: item[2],
  meaning: item[3],
  example: item[4],
  exampleTranslation: item[5],
  category: item[6],
  icon: item[7]
}));

const CATEGORIES = [
  { name: 'ALL', label: 'Tất cả', icon: Star, color: 'bg-indigo-600 text-white' },
  { name: 'Động vật', label: 'Động vật', icon: Cat, color: 'bg-amber-500 text-white' },
  { name: 'Trường học', label: 'Trường học', icon: School, color: 'bg-blue-500 text-white' },
  { name: 'Đồ ăn', label: 'Đồ ăn', icon: Apple, color: 'bg-rose-500 text-white' },
  { name: 'Thiên nhiên', label: 'Thiên nhiên', icon: Sun, color: 'bg-emerald-500 text-white' },
  { name: 'Gia đình', label: 'Gia đình', icon: Users, color: 'bg-orange-500 text-white' },
  { name: 'Cơ thể', label: 'Cơ thể', icon: Smile, color: 'bg-pink-500 text-white' },
  { name: 'Màu sắc', label: 'Màu sắc', icon: Palette, color: 'bg-violet-500 text-white' },
  { name: 'Quần áo', label: 'Quần áo', icon: Shirt, color: 'bg-cyan-500 text-white' },
  { name: 'Trang phục', label: 'Trang phục', icon: Shirt, color: 'bg-cyan-600 text-white' },
  { name: 'Nhà cửa', label: 'Nhà cửa', icon: Home, color: 'bg-teal-500 text-white' },
  { name: 'Phương tiện', label: 'Phương tiện', icon: Car, color: 'bg-slate-500 text-white' },
  { name: 'Nghề nghiệp', label: 'Nghề nghiệp', icon: Briefcase, color: 'bg-stone-500 text-white' },
  { name: 'Trái cây', label: 'Trái cây', icon: Apple, color: 'bg-red-400 text-white' },
  { name: 'Rau củ', label: 'Rau củ', icon: Carrot, color: 'bg-orange-400 text-white' },
  { name: 'Thể thao', label: 'Thể thao', icon: Trophy, color: 'bg-yellow-500 text-white' },
  { name: 'Thời tiết', label: 'Thời tiết', icon: Cloud, color: 'bg-sky-400 text-white' },
  { name: 'Thời gian', label: 'Thời gian', icon: Clock, color: 'bg-indigo-400 text-white' },
  { name: 'Nơi chốn', label: 'Nơi chốn', icon: MapPin, color: 'bg-red-500 text-white' },
  { name: 'Đồ chơi', label: 'Đồ chơi', icon: Gamepad2, color: 'bg-lime-500 text-white' },
  { name: 'Hình khối', label: 'Hình khối', icon: Square, color: 'bg-fuchsia-500 text-white' },
  { name: 'Cảm xúc', label: 'Cảm xúc', icon: Smile, color: 'bg-yellow-400 text-white' },
  { name: 'Tự nhiên', label: 'Tự nhiên', icon: Leaf, color: 'bg-green-600 text-white' },
  { name: 'Động tác', label: 'Động tác', icon: Activity, color: 'bg-blue-600 text-white' },
  { name: 'Công nghệ', label: 'Công nghệ', icon: Laptop, color: 'bg-slate-700 text-white' },
  { name: 'Nhà bếp', label: 'Nhà bếp', icon: Utensils, color: 'bg-orange-600 text-white' },
  { name: 'Đồ vật', label: 'Đồ vật', icon: Box, color: 'bg-stone-400 text-white' },
  { name: 'Đồ uống', label: 'Đồ uống', icon: Coffee, color: 'bg-amber-600 text-white' },
  { name: 'Đồ ăn vặt', label: 'Đồ ăn vặt', icon: Cake, color: 'bg-pink-400 text-white' },
  { name: 'Lễ hội', label: 'Lễ hội', icon: Gift, color: 'bg-red-600 text-white' },
  { name: 'Không gian', label: 'Không gian', icon: Home, color: 'bg-cyan-700 text-white' },
  { name: 'Nhạc cụ', label: 'Nhạc cụ', icon: Music, color: 'bg-violet-600 text-white' },
  { name: 'Thực vật', label: 'Thực vật', icon: Leaf, color: 'bg-emerald-600 text-white' },
  { name: 'Thú cưng', label: 'Thú cưng', icon: Cat, color: 'bg-amber-400 text-white' },
  { name: 'Côn trùng', label: 'Côn trùng', icon: Bug, color: 'bg-lime-600 text-white' },
  { name: 'Trang sức', label: 'Trang sức', icon: Star, color: 'bg-fuchsia-600 text-white' },
  { name: 'Vũ trụ', label: 'Vũ trụ', icon: Rocket, color: 'bg-indigo-700 text-white' },
  { name: 'Tính từ', label: 'Tính từ', icon: List, color: 'bg-slate-400 text-white' },
  { name: 'Tính cách', label: 'Tính cách', icon: Heart, color: 'bg-rose-400 text-white' },
  { name: 'Hành động', label: 'Hành động', icon: Activity, color: 'bg-blue-500 text-white' },
  { name: 'Sức khỏe', label: 'Sức khỏe', icon: Activity, color: 'bg-red-500 text-white' },
  { name: 'Hoạt động', label: 'Hoạt động', icon: Activity, color: 'bg-orange-500 text-white' },
  { name: 'Cắm trại', label: 'Cắm trại', icon: Tent, color: 'bg-green-700 text-white' },
  { name: 'Giao tiếp', label: 'Giao tiếp', icon: MessageCircle, color: 'bg-sky-500 text-white' },
  { name: 'Gia vị', label: 'Gia vị', icon: Utensils, color: 'bg-yellow-600 text-white' },
  { name: 'Vị trí', label: 'Vị trí', icon: MapPin, color: 'bg-indigo-500 text-white' },
  { name: 'Ngữ pháp', label: 'Ngữ pháp', icon: BookOpen, color: 'bg-violet-700 text-white' },
  { name: 'Cá nhân', label: 'Cá nhân', icon: Briefcase, color: 'bg-teal-500 text-white' },
  { name: 'Cổ tích', label: 'Cổ tích', icon: Star, color: 'bg-purple-500 text-white' },
  { name: 'Thú rừng', label: 'Thú rừng', icon: Cat, color: 'bg-emerald-600 text-white' },
  { name: 'Trái cây 3', label: 'Trái cây 3', icon: Apple, color: 'bg-rose-400 text-white' },
  { name: 'Phòng tắm', label: 'Phòng tắm', icon: Home, color: 'bg-cyan-400 text-white' },
  { name: 'Vật liệu', label: 'Vật liệu', icon: Box, color: 'bg-stone-500 text-white' },
  { name: 'Trạng thái', label: 'Trạng thái', icon: Activity, color: 'bg-slate-500 text-white' },
  { name: 'Kiến trúc', label: 'Kiến trúc', icon: Home, color: 'bg-indigo-500 text-white' },
  { name: 'Loài chim', label: 'Loài chim', icon: Bug, color: 'bg-sky-400 text-white' },
  { name: 'Giác quan', label: 'Giác quan', icon: Smile, color: 'bg-pink-500 text-white' },
  { name: 'Cơ thể 2', label: 'Cơ thể 2', icon: Smile, color: 'bg-rose-500 text-white' },
  { name: 'Thảm họa', label: 'Thảm họa', icon: Cloud, color: 'bg-slate-700 text-white' },
  { name: 'Y tế', label: 'Y tế', icon: Heart, color: 'bg-red-500 text-white' },
  { name: 'Bánh kẹo', label: 'Bánh kẹo', icon: Cake, color: 'bg-pink-400 text-white' },
  { name: 'Đường thủy bay', label: 'Giao thông 2', icon: Rocket, color: 'bg-blue-600 text-white' },
  { name: 'Tính cách 2', label: 'Tính cách 2', icon: Heart, color: 'bg-violet-500 text-white' },
  { name: 'Họ hàng', label: 'Họ hàng', icon: Users, color: 'bg-orange-600 text-white' },
  { name: 'Đại từ', label: 'Đại từ', icon: Users, color: 'bg-cyan-600 text-white' },
  { name: 'Nghệ thuật', label: 'Nghệ thuật', icon: Palette, color: 'bg-fuchsia-500 text-white' },
  { name: 'Nhạc cụ 2', label: 'Nhạc cụ 2', icon: Music, color: 'bg-indigo-400 text-white' },
  { name: 'Học tập 2', label: 'Học tập 2', icon: BookOpen, color: 'bg-emerald-500 text-white' },
  { name: 'Vận động', label: 'Vận động', icon: Activity, color: 'bg-amber-500 text-white' },
  { name: 'Vũ trụ 2', label: 'Vũ trụ 2', icon: Rocket, color: 'bg-slate-800 text-white' },
  { name: 'Toán học', label: 'Toán học', icon: Square, color: 'bg-blue-500 text-white' },
  { name: 'Cảnh quan', label: 'Cảnh quan', icon: Sun, color: 'bg-green-500 text-white' }
];

export default function KidsFlashcard() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedWords, setLearnedWords] = useState(() => {
    try {
      const saved = localStorage.getItem('kidsFlashcardLearned');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Lỗi khi đọc localStorage:', error);
      return new Set();
    }
  });
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleMap, setShuffleMap] = useState(new Map());

  // --- TRẮC NGHIỆM (QUIZ MODE) ---
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null); // 'correct', 'incorrect'

  // Lưu trạng thái Đã thuộc vào LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kidsFlashcardLearned', JSON.stringify(Array.from(learnedWords)));
    } catch (error) {
      console.warn('Không thể lưu vào localStorage (có thể do môi trường bị hạn chế):', error);
    }
  }, [learnedWords]);

  // --- LỌC DỮ LIỆU ---
  const filteredData = useMemo(() => {
    let data = VOCABULARY_DATA;
    
    if (activeCategory !== 'ALL') {
      data = data.filter(word => word.category === activeCategory);
    }
    
    if (showUnlearnedOnly) {
      data = data.filter(word => !learnedWords.has(word.id));
    }
    
    if (isShuffled) {
      data = [...data].sort((a, b) => (shuffleMap.get(a.id) || 0) - (shuffleMap.get(b.id) || 0));
    }
    
    return data;
  }, [activeCategory, showUnlearnedOnly, learnedWords, isShuffled, shuffleMap]);

  // Reset index khi đổi filter
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory, showUnlearnedOnly]);

  // Hàm xử lý Xáo trộn
  const toggleShuffle = useCallback(() => {
    if (!isShuffled) {
      const newMap = new Map();
      VOCABULARY_DATA.forEach(w => newMap.set(w.id, Math.random()));
      setShuffleMap(newMap);
      setIsShuffled(true);
    } else {
      setIsShuffled(false);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [isShuffled]);

  // Mẹo: Khởi động sẵn danh sách giọng đọc khi ứng dụng load
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      // Đảm bảo load lại khi danh sách giọng trên máy thiết bị sẵn sàng
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Hàm phát âm với tốc độ chậm vừa phải cho bé
  const playAudio = useCallback((text) => {
    if (!window.speechSynthesis) {
      alert("Trình duyệt của bạn không hỗ trợ đọc tiếng Anh. Hãy thử dùng Google Chrome hoặc Safari nhé!");
      return;
    }
    
    // Gọi resume() trước khi cancel() giúp chống "kẹt" âm thanh trên iOS/Android
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.6; // Đọc rất chậm và rõ chữ, phù hợp cho học sinh 8-12 tuổi
    utterance.pitch = 1.1; // Giọng hơi cao một chút cho vui nhộn

    // Cố gắng chọn một giọng tiếng Anh chuẩn (Google, Apple,...)
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const englishVoice = voices.find(v => (v.lang === 'en-US' || v.lang === 'en_US') && (v.name.includes('Google') || v.name.includes('Apple') || v.name.includes('Samantha'))) || voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  // --- TẠO CÂU HỎI TRẮC NGHIỆM ---
  const generateQuestion = useCallback(() => {
    let sourceData = filteredData.length >= 4 ? filteredData : VOCABULARY_DATA;
    if (sourceData.length === 0) sourceData = VOCABULARY_DATA; // Fallback an toàn

    const targetWord = sourceData[Math.floor(Math.random() * sourceData.length)];
    const types = ['mcq', 'tf', 'listen', 'fill'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let question = { type, targetWord, options: [], answer: null, sentence: '', displayedMeaning: '' };
    
    const getWrongWords = (n) => {
        let wrongs = [];
        let allWords = VOCABULARY_DATA;
        let attempts = 0;
        while(wrongs.length < n && attempts < 100) {
            let w = allWords[Math.floor(Math.random() * allWords.length)];
            if(w.id !== targetWord.id && !wrongs.find(x => x.id === w.id)) {
                wrongs.push(w);
            }
            attempts++;
        }
        return wrongs;
    };

    if (type === 'mcq') {
        const wrongs = getWrongWords(3);
        question.options = [targetWord, ...wrongs].sort(() => Math.random() - 0.5);
        question.answer = targetWord.id;
    } else if (type === 'tf') {
        const isTrue = Math.random() > 0.5;
        const wrongWord = getWrongWords(1)[0];
        question.displayedMeaning = isTrue ? targetWord.meaning : wrongWord.meaning;
        question.answer = isTrue;
    } else if (type === 'listen') {
        const wrongs = getWrongWords(3);
        question.options = [targetWord, ...wrongs].sort(() => Math.random() - 0.5);
        question.answer = targetWord.id;
        setTimeout(() => playAudio(targetWord.word), 500); // Tự động đọc
    } else if (type === 'fill') {
        const regex = new RegExp(`\\b${targetWord.word}\\b`, 'gi');
        if (targetWord.example.match(regex)) {
            const wrongs = getWrongWords(3);
            question.options = [targetWord, ...wrongs].sort(() => Math.random() - 0.5);
            question.answer = targetWord.id;
            question.sentence = targetWord.example.replace(regex, '______');
        } else {
            // Dự phòng nếu không match được chính xác từ (ví dụ danh từ số nhiều)
            question.type = 'mcq';
            const wrongs = getWrongWords(3);
            question.options = [targetWord, ...wrongs].sort(() => Math.random() - 0.5);
            question.answer = targetWord.id;
        }
    }
    
    setCurrentQuestion(question);
    setQuizFeedback(null);
  }, [filteredData, playAudio]);

  useEffect(() => {
    if (isQuizMode) generateQuestion();
  }, [isQuizMode, activeCategory, showUnlearnedOnly, generateQuestion]);

  // --- ĐIỀU KHIỂN BÀN PHÍM ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isQuizMode) return; // Khóa phím thẻ lật khi đang làm trắc nghiệm
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredData, currentIndex, isQuizMode]);

  // --- ACTIONS ---
  const handleNext = () => {
    if (filteredData.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredData.length);
  };

  const handlePrev = () => {
    if (filteredData.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
  };

  // Xử lý khi chọn đáp án trắc nghiệm
  const handleAnswer = (isCorrect) => {
    if (quizFeedback) return; // Chống click đúp
    setQuizTotal(prev => prev + 1);
    if (isCorrect) {
        setQuizScore(prev => prev + 1);
        setQuizFeedback('correct');
        playAudio("Excellent!"); 
    } else {
        setQuizFeedback('incorrect');
        playAudio("Oops!");
    }
    
    setTimeout(() => generateQuestion(), 2500); // Đợi 2.5s để xem kết quả
  };

  const toggleLearned = (id) => {
    setLearnedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    
    // Tự động nhảy sang thẻ tiếp theo nếu bé đánh dấu là Đã thuộc
    if (!learnedWords.has(id)) {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  // --- TIẾN ĐỘ HỌC TẬP ---
  const totalCategoryWords = activeCategory === 'ALL' 
    ? VOCABULARY_DATA.length 
    : VOCABULARY_DATA.filter(w => w.category === activeCategory).length;
    
  const learnedCategoryWords = activeCategory === 'ALL'
    ? Array.from(learnedWords).length
    : Array.from(learnedWords).filter(id => VOCABULARY_DATA.find(w => w.id === id)?.category === activeCategory).length;

  const progressPercentage = totalCategoryWords === 0 ? 0 : Math.round((learnedCategoryWords / totalCategoryWords) * 100);
  const safeIndex = currentIndex >= filteredData.length ? 0 : currentIndex;
  const currentCard = filteredData[safeIndex];

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col font-sans text-slate-800 pb-10">
      {/* CSS cho hiệu ứng lật 3D */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .kid-shadow { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
      `}</style>

      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-black text-sky-600 flex items-center gap-2 tracking-tight">
              <Star className="text-amber-400 fill-amber-400" />
              Kids Flashcard
            </h1>
            
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto flex-wrap">
              
              {/* Nút chuyển đổi chế độ */}
              <button 
                onClick={() => setIsQuizMode(!isQuizMode)}
                className={`px-4 py-2 font-black rounded-xl transition-all border-2 flex items-center gap-2 ${isQuizMode ? 'bg-indigo-500 text-white border-indigo-600 shadow-md scale-105' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
              >
                {isQuizMode ? <BookOpen size={20} /> : <Gamepad2 size={20} />}
                {isQuizMode ? "Học Từ" : "Trắc Nghiệm"}
              </button>

              <div className="text-sm font-bold text-sky-700 bg-sky-100 px-4 py-2 rounded-full border border-sky-200">
                Đã thuộc: <span className="text-emerald-600 text-lg ml-1">{learnedCategoryWords}/{totalCategoryWords}</span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={toggleShuffle}
                  className={`p-2 rounded-xl transition-colors border-2 ${isShuffled ? 'bg-violet-100 border-violet-400 text-violet-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                  title={isShuffled ? "Tắt xáo trộn" : "Bật xáo trộn thẻ"}
                >
                  <Shuffle size={24} />
                </button>
                
                <button 
                  onClick={() => setShowUnlearnedOnly(!showUnlearnedOnly)}
                  className={`p-2 rounded-xl transition-colors border-2 ${showUnlearnedOnly ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                  title={showUnlearnedOnly ? "Đang lọc từ chưa thuộc" : "Bấm để lọc từ chưa thuộc"}
                >
                  <Filter size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Thanh Tiến Trình */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-4 border border-slate-300">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Danh mục (Categories) */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button 
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all border-2 ${isActive ? `${cat.color} border-transparent scale-105 shadow-md` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                  <Icon size={18} /> {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 mt-6">
        
        {isQuizMode ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="w-full bg-white rounded-[2rem] kid-shadow border-4 border-indigo-100 p-6 sm:p-8 relative min-h-[400px] flex flex-col justify-center overflow-hidden">
              
              <div className="absolute top-4 right-6 font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200 z-10 text-sm">
                 Điểm: {quizScore} / {quizTotal}
              </div>

              {/* Overlay hiển thị kết quả */}
              {quizFeedback && (
                <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm ${quizFeedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'} transition-all`}>
                  {quizFeedback === 'correct' ? <CheckCircle2 size={100} className="animate-bounce drop-shadow-md" /> : <XCircle size={100} className="animate-bounce drop-shadow-md" />}
                  <h2 className="text-3xl sm:text-4xl font-black mt-6 text-center px-4">
                     {quizFeedback === 'correct' ? 'Hoan hô! Rất giỏi! 🎉' : 'Sai mất rồi bé ơi! 😢'}
                  </h2>
                  {quizFeedback === 'incorrect' && (
                    <p className="mt-4 text-xl font-bold text-slate-600 text-center px-4">
                      Đáp án đúng là: <br/> 
                      <span className="text-indigo-600 text-2xl mt-2 block">
                        {currentQuestion?.type === 'tf' ? (currentQuestion.answer ? 'Đúng' : 'Sai') : 
                         currentQuestion?.type === 'mcq' ? currentQuestion.targetWord.meaning : 
                         currentQuestion?.targetWord.word}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Nội dung câu hỏi */}
              {currentQuestion && (
                 <div className="w-full relative z-0 mt-4 sm:mt-0">
                    
                    {/* --- KIỂU 1: CHỌN NGHĨA TỪ (MCQ) --- */}
                    {currentQuestion.type === 'mcq' && (
                      <>
                        <div className="text-center mb-8">
                           <span className="text-6xl mb-4 block drop-shadow-sm">{currentQuestion.targetWord.icon}</span>
                           <h3 className="text-lg sm:text-xl font-bold text-slate-500 uppercase tracking-widest">Nghĩa của từ</h3>
                           <h2 className="text-4xl sm:text-5xl font-black text-indigo-600 my-2">"{currentQuestion.targetWord.word}"</h2>
                           <h3 className="text-lg sm:text-xl font-bold text-slate-500">là gì?</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                           {currentQuestion.options.map((opt, i) => (
                             <button 
                               key={opt.id} onClick={() => handleAnswer(opt.id === currentQuestion.answer)}
                               className="p-4 rounded-2xl border-4 border-slate-100 font-bold text-lg sm:text-xl text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 transition-all active:scale-95 flex items-center gap-3 sm:gap-4 text-left group bg-white"
                             >
                               <span className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-slate-100 text-slate-500 flex items-center justify-center rounded-full font-black text-base sm:text-lg group-hover:bg-indigo-200 group-hover:text-indigo-700 transition-colors">
                                 {['A', 'B', 'C', 'D'][i]}
                               </span>
                               <span>{opt.meaning}</span>
                             </button>
                           ))}
                        </div>
                      </>
                    )}

                    {/* --- KIỂU 2: ĐÚNG / SAI --- */}
                    {currentQuestion.type === 'tf' && (
                      <>
                        <div className="text-center mb-10">
                           <span className="text-6xl mb-4 block drop-shadow-sm">{currentQuestion.targetWord.icon}</span>
                           <h3 className="text-xl sm:text-2xl font-bold text-slate-600 leading-relaxed">
                             Từ <span className="text-3xl sm:text-4xl font-black text-indigo-600 mx-1 sm:mx-2">"{currentQuestion.targetWord.word}"</span><br/>
                             có nghĩa là <span className="text-2xl sm:text-3xl font-black text-rose-500 mx-1 sm:mx-2">"{currentQuestion.displayedMeaning}"</span><br/>
                             đúng không bé?
                           </h3>
                        </div>
                        <div className="flex justify-center gap-4 sm:gap-6">
                           <button 
                             onClick={() => handleAnswer(currentQuestion.answer === true)}
                             className="flex-1 max-w-[200px] py-4 bg-emerald-500 text-white rounded-2xl font-black text-xl sm:text-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all border-b-4 border-emerald-700"
                           >
                             ĐÚNG
                           </button>
                           <button 
                             onClick={() => handleAnswer(currentQuestion.answer === false)}
                             className="flex-1 max-w-[200px] py-4 bg-rose-500 text-white rounded-2xl font-black text-xl sm:text-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all border-b-4 border-rose-700"
                           >
                             SAI
                           </button>
                        </div>
                      </>
                    )}

                    {/* --- KIỂU 3: NGHE VÀ CHỌN --- */}
                    {currentQuestion.type === 'listen' && (
                      <>
                        <div className="text-center mb-8">
                           <button 
                             onClick={() => playAudio(currentQuestion.targetWord.word)}
                             className="p-6 sm:p-8 bg-sky-500 text-white rounded-full hover:bg-sky-600 active:scale-95 transition-all shadow-xl shadow-sky-200 border-4 border-white mx-auto animate-pulse flex items-center justify-center"
                           >
                              <Volume2 size={48} />
                           </button>
                           <h3 className="text-xl sm:text-2xl font-bold text-slate-600 mt-6">Nghe và chọn từ chính xác:</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                           {currentQuestion.options.map((opt, i) => (
                             <button 
                               key={opt.id} onClick={() => handleAnswer(opt.id === currentQuestion.answer)}
                               className="p-4 rounded-2xl border-4 border-slate-100 font-black text-xl sm:text-2xl text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 bg-white"
                             >
                               <span className="text-3xl sm:text-4xl">{opt.icon}</span>
                               <span className="truncate w-full text-center">{opt.word}</span>
                             </button>
                           ))}
                        </div>
                      </>
                    )}

                    {/* --- KIỂU 4: ĐIỀN TỪ --- */}
                    {currentQuestion.type === 'fill' && (
                      <>
                        <div className="text-center mb-8 mt-4">
                           <h3 className="text-lg sm:text-2xl font-bold text-slate-600 mb-4">Điền từ còn thiếu vào câu:</h3>
                           <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl relative">
                              <span className="absolute -top-4 -left-4 text-4xl">{currentQuestion.targetWord.icon}</span>
                              <p className="text-xl sm:text-3xl font-black text-amber-700 leading-snug">
                                "{currentQuestion.sentence}"
                              </p>
                              <p className="text-base sm:text-lg font-medium text-amber-600 mt-4 border-t border-amber-200 pt-4">
                                Nghĩa: {currentQuestion.targetWord.exampleTranslation}
                              </p>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                           {currentQuestion.options.map((opt, i) => (
                             <button 
                               key={opt.id} onClick={() => handleAnswer(opt.id === currentQuestion.answer)}
                               className="p-3 sm:p-4 rounded-2xl border-4 border-slate-100 font-bold text-lg sm:text-xl text-slate-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 transition-all active:scale-95 flex items-center gap-3 sm:gap-4 text-left bg-white group"
                             >
                               <span className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-slate-100 text-slate-500 flex items-center justify-center rounded-full font-black text-base sm:text-lg group-hover:bg-amber-200 group-hover:text-amber-700 transition-colors">
                                 {['A', 'B', 'C', 'D'][i]}
                               </span>
                               <span>{opt.word}</span>
                             </button>
                           ))}
                        </div>
                      </>
                    )}
                 </div>
              )}
            </div>

            {/* Nút Bỏ qua */}
            <button 
              onClick={generateQuestion}
              className="mt-6 px-6 py-3 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 transition-colors active:scale-95 flex items-center gap-2 shadow-sm"
            >
              Bỏ qua câu này <ChevronRight size={20} />
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-[2rem] kid-shadow border-4 border-emerald-100 max-w-md w-full animate-bounce">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-3xl font-black text-emerald-600 mb-2">Hoan hô bé!</h2>
            <p className="text-slate-600 font-medium text-lg">Bé đã học thuộc hết các từ trong mục này rồi!</p>
            <button 
              onClick={() => setShowUnlearnedOnly(false)}
              className="mt-8 px-8 py-4 bg-sky-500 text-white font-black text-lg rounded-2xl hover:bg-sky-600 transition-colors shadow-lg active:scale-95"
            >
              Ôn tập lại từ đầu nhé!
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col items-center">
            
            {/* Đếm số thẻ */}
            <div className="bg-sky-200 text-sky-800 font-black px-4 py-1.5 rounded-full mb-6 text-sm shadow-sm border border-sky-300">
              Thẻ số {safeIndex + 1} / {filteredData.length}
            </div>

            {/* FLASHCARD CONTAINER */}
            <div 
              className="relative w-full aspect-[3/4] sm:aspect-square perspective-1000 cursor-pointer group"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* MẶT TRƯỚC (TIẾNG ANH) */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] kid-shadow border-4 border-slate-100 flex flex-col items-center justify-center p-6 text-center">
                  
                  {/* Badge Chủ đề */}
                  <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-black text-white bg-sky-400 uppercase tracking-wider">
                    {currentCard.category}
                  </div>
                  
                  {/* Dấu tích xanh nếu đã thuộc */}
                  {learnedWords.has(currentCard.id) && (
                    <div className="absolute top-6 right-6 text-emerald-500 bg-emerald-50 rounded-full p-1">
                      <CheckCircle2 size={32} />
                    </div>
                  )}

                  {/* Icon & Từ vựng */}
                  <div className="text-8xl mb-6 drop-shadow-md">{currentCard.icon}</div>
                  
                  <h2 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">
                    {currentCard.word}
                  </h2>
                  
                  <p className="text-xl text-sky-600 font-bold mb-3 bg-sky-50 px-4 py-1 rounded-full">
                    {currentCard.phonetic}
                  </p>
                  
                  <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold uppercase tracking-widest">
                    {currentCard.type}
                  </span>

                  {/* Nút Loa Âm Thanh */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); playAudio(currentCard.word); }}
                    className="mt-6 p-5 bg-amber-400 text-white rounded-full hover:bg-amber-500 hover:scale-110 active:scale-95 transition-all shadow-lg border-4 border-amber-200"
                  >
                    <Volume2 size={36} />
                  </button>

                  <p className="absolute bottom-6 text-slate-300 text-xs font-black uppercase tracking-widest animate-pulse">
                    👉 Bấm vào thẻ để lật 👈
                  </p>
                </div>

                {/* MẶT SAU (TIẾNG VIỆT & VÍ DỤ) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-sky-500 rounded-[2.5rem] kid-shadow border-4 border-sky-400 flex flex-col justify-center items-center p-8 text-white text-center">
                  
                  <div className="text-7xl mb-4 opacity-50">{currentCard.icon}</div>

                  <h3 className="text-4xl font-black mb-6 text-yellow-300 drop-shadow-md">
                    {currentCard.meaning}
                  </h3>

                  <div className="bg-white/20 rounded-3xl p-6 backdrop-blur-sm border border-white/30 w-full">
                    <p className="text-2xl font-bold leading-snug mb-3">
                      "{currentCard.example}"
                    </p>
                    <p className="text-lg text-sky-100 font-medium">
                      {currentCard.exampleTranslation}
                    </p>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); playAudio(currentCard.example); }}
                    className="absolute top-6 right-6 p-4 bg-white/20 rounded-full hover:bg-white/30 hover:scale-110 active:scale-95 transition-all border-2 border-white/30"
                  >
                    <Volume2 size={24} />
                  </button>

                  <p className="absolute bottom-6 text-sky-200 text-xs font-black uppercase tracking-widest">
                    👉 Bấm để quay lại 👈
                  </p>
                </div>

              </div>
            </div>

            {/* --- THANH ĐIỀU KHIỂN DƯỚI CÙNG --- */}
            <div className="w-full flex items-center justify-between gap-4 mt-10">
              
              {/* Nút Lùi */}
              <button 
                onClick={handlePrev}
                className="w-16 h-16 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <ChevronLeft size={32} />
              </button>

              {/* Nhóm nút Đánh dấu thuộc/chưa thuộc */}
              <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border-2 border-slate-100 shadow-sm">
                <button 
                  onClick={() => {
                    if(learnedWords.has(currentCard.id)) toggleLearned(currentCard.id);
                    handleNext();
                  }}
                  className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all hover:bg-rose-50 group"
                  title="Chưa thuộc"
                >
                  <XCircle size={32} className={!learnedWords.has(currentCard.id) ? 'text-rose-500' : 'text-slate-300'} />
                  <span className="text-[9px] font-black text-slate-400 mt-1 uppercase">Chưa Nhớ</span>
                </button>

                <div className="w-0.5 h-10 bg-slate-100"></div>

                <button 
                  onClick={() => toggleLearned(currentCard.id)}
                  className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all hover:bg-emerald-50 group"
                  title="Đã thuộc"
                >
                  <CheckCircle2 size={32} className={learnedWords.has(currentCard.id) ? 'text-emerald-500' : 'text-slate-300'} />
                  <span className="text-[9px] font-black text-slate-400 mt-1 uppercase">Đã Thuộc</span>
                </button>
              </div>

              {/* Nút Tiến */}
              <button 
                onClick={handleNext}
                className="w-16 h-16 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <ChevronRight size={32} />
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}