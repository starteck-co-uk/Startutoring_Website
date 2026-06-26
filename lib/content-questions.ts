// Parsed from content/ folder OCR extracts + GL Assessment-style supplementary questions
import type { Question } from './types';

// ─── 28 Maths questions parsed from content/math.txt (11+ Mock Exam) ───
export const CONTENT_MATHS_11PLUS: Question[] = [
  { text: 'What is 3,456 + 2,789?', options: ['5,245', '6,245', '6,345', '6,145'], correct: 1, explanation: '3,456 + 2,789 = 6,245.' },
  { text: 'What is 8,003 − 4,567?', options: ['3,536', '3,436', '3,336', '4,436'], correct: 1, explanation: '8,003 − 4,567 = 3,436.' },
  { text: 'What is 347 × 6?', options: ['2,182', '1,982', '2,082', '2,282'], correct: 2, explanation: '347 × 6 = 2,082.' },
  { text: 'What is 1,764 ÷ 12?', options: ['148', '146', '149', '147'], correct: 3, explanation: '1,764 ÷ 12 = 147.' },
  { text: 'What is 2/5 of 350?', options: ['150', '140', '130', '170'], correct: 1, explanation: '350 ÷ 5 = 70, then 70 × 2 = 140.' },
  { text: 'Convert 0.75 to a fraction in simplest form.', options: ['7/10', '15/20', '3/4', '6/8'], correct: 2, explanation: '0.75 = 75/100 = 3/4 in simplest form.' },
  { text: 'What is 15% of 240?', options: ['24', '36', '30', '48'], correct: 1, explanation: '10% of 240 = 24, 5% = 12, so 15% = 36.' },
  { text: 'A regular hexagon has a perimeter of 42 cm. What is the length of one side?', options: ['6 cm', '8 cm', '5 cm', '7 cm'], correct: 3, explanation: '42 ÷ 6 sides = 7 cm per side.' },
  { text: 'What is the area of a triangle with base 10 cm and height 6 cm?', options: ['60 cm²', '30 cm²', '16 cm²', '36 cm²'], correct: 1, explanation: 'Area = ½ × base × height = ½ × 10 × 6 = 30 cm².' },
  { text: 'A cuboid is 5 cm × 4 cm × 3 cm. What is its volume?', options: ['50 cm³', '12 cm³', '60 cm³', '24 cm³'], correct: 2, explanation: 'Volume = 5 × 4 × 3 = 60 cm³.' },
  { text: 'What is the next number in the sequence: 3, 7, 15, 31, ?', options: ['47', '63', '55', '62'], correct: 1, explanation: 'Each number is doubled then +1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63.' },
  { text: 'Simplify: 4/6 + 1/3', options: ['5/6', '7/9', '1', '2/3'], correct: 2, explanation: '4/6 = 2/3, then 2/3 + 1/3 = 3/3 = 1.' },
  { text: 'What is the mean of 12, 15, 18, 21, and 24?', options: ['15', '20', '19', '18'], correct: 3, explanation: 'Sum = 90, count = 5, mean = 90 ÷ 5 = 18.' },
  { text: 'A clock shows 3:45 PM. What angle do the hands make?', options: ['172.5°', '157.5°', '150°', '180°'], correct: 1, explanation: 'At 3:45, minute hand at 270° and hour hand at 112.5°, giving 157.5°.' },
  { text: 'If a = 4 and b = 7, what is 3a + 2b?', options: ['24', '22', '28', '26'], correct: 3, explanation: '3(4) + 2(7) = 12 + 14 = 26.' },
  { text: 'What is the perimeter of a semicircle with diameter 14 cm? (π ≈ 22/7)', options: ['22 cm', '44 cm', '36 cm', '50 cm'], correct: 2, explanation: 'Perimeter = πd/2 + d = 22 + 14 = 36 cm.' },
  { text: 'A bag has 3 red, 5 blue and 2 green balls. What is the probability of picking a blue ball?', options: ['1/3', '1/2', '3/10', '2/5'], correct: 1, explanation: 'Total = 10, blue = 5, probability = 5/10 = 1/2.' },
  { text: 'Convert 2.5 hours into minutes.', options: ['125 minutes', '160 minutes', '150 minutes', '145 minutes'], correct: 2, explanation: '2.5 × 60 = 150 minutes.' },
  { text: 'A rectangle has length 15 cm and width 8 cm. What is its perimeter?', options: ['23 cm', '46 cm', '120 cm', '38 cm'], correct: 1, explanation: 'Perimeter = 2(15 + 8) = 2 × 23 = 46 cm.' },
  { text: 'Round 4,567 to the nearest hundred.', options: ['4,500', '4,570', '4,600', '5,000'], correct: 2, explanation: '4,567 rounds up to 4,600 (67 ≥ 50).' },
  { text: 'What are the factors of 36?', options: ['1,2,3,6,12,36', '1,2,4,6,9,36', '1,2,3,4,6,9,12,18,36', '1,3,6,9,18,36'], correct: 2, explanation: '36 has factors: 1, 2, 3, 4, 6, 9, 12, 18, 36.' },
  { text: 'A pie chart shows 90° for Science. What fraction of students chose Science?', options: ['1/3', '1/4', '1/2', '1/5'], correct: 1, explanation: '90° out of 360° = 90/360 = 1/4.' },
  { text: 'What is the lowest common multiple (LCM) of 6 and 8?', options: ['48', '12', '16', '24'], correct: 3, explanation: 'Multiples of 6: 6,12,18,24. Multiples of 8: 8,16,24. LCM = 24.' },
  { text: 'What is 4³?', options: ['12', '64', '16', '48'], correct: 1, explanation: '4³ = 4 × 4 × 4 = 64.' },
  { text: 'A shop offers 20% off a £45 jacket. What is the sale price?', options: ['£38', '£40', '£35', '£36'], correct: 3, explanation: '20% of £45 = £9, sale price = £45 − £9 = £36.' },
  { text: 'If 5x − 3 = 22, what is x?', options: ['4', '3', '5', '6'], correct: 2, explanation: '5x = 25, x = 5.' },
  { text: 'How many millilitres are in 3.5 litres?', options: ['350 ml', '3,500 ml', '35,000 ml', '3,050 ml'], correct: 1, explanation: '3.5 × 1,000 = 3,500 ml.' },
  { text: 'What is the highest common factor (HCF) of 24 and 36?', options: ['6', '8', '4', '12'], correct: 3, explanation: 'Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. HCF = 12.' },
];

// ─── 76 Verbal Reasoning questions parsed from content/verbal.txt ───
export const CONTENT_VERBAL_11PLUS: Question[] = [
  // Opposite Words
  { text: 'Select the word that is most opposite in meaning to: GENEROUS', options: ['Kind', 'Mean', 'Wealthy', 'Gentle'], correct: 1, explanation: 'Mean (stingy) is the opposite of generous.' },
  { text: 'Select the word that is most opposite in meaning to: ANCIENT', options: ['Old', 'Modern', 'Historic', 'Antique'], correct: 1, explanation: 'Modern is the opposite of ancient.' },
  { text: 'Select the word that is most opposite in meaning to: BRAVE', options: ['Bold', 'Cowardly', 'Strong', 'Fierce'], correct: 1, explanation: 'Cowardly is the opposite of brave.' },
  { text: 'Select the word that is most opposite in meaning to: EXPAND', options: ['Grow', 'Shrink', 'Stretch', 'Widen'], correct: 1, explanation: 'Shrink is the opposite of expand.' },
  { text: 'Select the word that is most opposite in meaning to: TRANQUIL', options: ['Calm', 'Peaceful', 'Turbulent', 'Serene'], correct: 2, explanation: 'Turbulent is the opposite of tranquil (peaceful).' },
  { text: 'Select the word that is most opposite in meaning to: LUMINOUS', options: ['Bright', 'Dim', 'Shiny', 'Radiant'], correct: 1, explanation: 'Dim is the opposite of luminous (bright/shining).' },
  { text: 'Select the word that is most opposite in meaning to: FLEXIBLE', options: ['Rigid', 'Bendy', 'Elastic', 'Supple'], correct: 0, explanation: 'Rigid is the opposite of flexible.' },
  { text: 'Select the word that is most opposite in meaning to: CAUTIOUS', options: ['Careful', 'Reckless', 'Timid', 'Wary'], correct: 1, explanation: 'Reckless is the opposite of cautious.' },
  { text: 'Select the word that is most opposite in meaning to: ABUNDANT', options: ['Plentiful', 'Ample', 'Scarce', 'Generous'], correct: 2, explanation: 'Scarce is the opposite of abundant (plentiful).' },
  { text: 'Select the word that is most opposite in meaning to: PERMANENT', options: ['Lasting', 'Temporary', 'Fixed', 'Stable'], correct: 1, explanation: 'Temporary is the opposite of permanent.' },

  // Odd Word Out
  { text: 'Find the odd one out: Eagle, Sparrow, Penguin, Bat, Robin', options: ['Eagle', 'Penguin', 'Bat', 'Robin'], correct: 2, explanation: 'Bat is a mammal; the others are all birds.' },
  { text: 'Find the odd one out: Piano, Violin, Guitar, Trumpet, Cello', options: ['Piano', 'Guitar', 'Trumpet', 'Cello'], correct: 2, explanation: 'Trumpet is a wind instrument; the others are string instruments.' },
  { text: 'Find the odd one out: Square, Rectangle, Triangle, Cube, Pentagon', options: ['Square', 'Triangle', 'Cube', 'Pentagon'], correct: 2, explanation: 'Cube is a 3D shape; the others are 2D shapes.' },
  { text: 'Find the odd one out: Mercury, Venus, Moon, Mars, Jupiter', options: ['Mercury', 'Venus', 'Moon', 'Mars'], correct: 2, explanation: 'Moon is a satellite; the others are planets.' },
  { text: 'Find the odd one out: Oak, Elm, Rose, Ash, Birch', options: ['Oak', 'Elm', 'Rose', 'Birch'], correct: 2, explanation: 'Rose is a flower; the others are trees.' },
  { text: 'Find the odd one out: Knife, Fork, Spoon, Plate, Ladle', options: ['Fork', 'Spoon', 'Plate', 'Ladle'], correct: 2, explanation: 'Plate is crockery; the others are cutlery/utensils.' },
  { text: 'Find the odd one out: Crimson, Scarlet, Azure, Ruby, Vermilion', options: ['Crimson', 'Scarlet', 'Azure', 'Ruby'], correct: 2, explanation: 'Azure is a shade of blue; the others are shades of red.' },
  { text: 'Find the odd one out: Oxygen, Nitrogen, Carbon, Diamond, Helium', options: ['Oxygen', 'Nitrogen', 'Diamond', 'Helium'], correct: 2, explanation: 'Diamond is a form of carbon but is not an element name; the others are elements.' },
  { text: 'Find the odd one out: London, Paris, France, Berlin, Tokyo', options: ['London', 'Paris', 'France', 'Berlin'], correct: 2, explanation: 'France is a country; the others are capital cities.' },
  { text: 'Find the odd one out: Walk, Run, Sprint, Sit, Jog', options: ['Walk', 'Run', 'Sit', 'Jog'], correct: 2, explanation: 'Sit is stationary; the others involve moving on foot.' },

  // Reading Comprehension
  { text: 'A passage states: "The Arctic fox changes its fur colour from brown in summer to white in winter." Why does the fox change colour?', options: ['To attract mates', 'For camouflage in different seasons', 'Due to illness', 'To regulate temperature'], correct: 1, explanation: 'The fur colour matches the environment — brown for earth, white for snow — providing camouflage.' },
  { text: '"The Victorian era saw the expansion of the British Empire and the Industrial Revolution." When was the Victorian era?', options: ['1714–1830', '1837–1901', '1901–1952', '1952–present'], correct: 1, explanation: 'The Victorian era corresponds to Queen Victoria\'s reign, 1837–1901.' },
  { text: '"Photosynthesis is the process by which plants convert sunlight into energy." What do plants need for photosynthesis?', options: ['Moonlight and soil', 'Sunlight, water and CO₂', 'Wind and rain', 'Darkness and oxygen'], correct: 1, explanation: 'Plants need sunlight, water, and carbon dioxide for photosynthesis.' },
  { text: '"The Rosetta Stone helped scholars decode Egyptian hieroglyphics because it had the same text in three scripts." How many scripts were on the Rosetta Stone?', options: ['Two', 'Three', 'Four', 'Five'], correct: 1, explanation: 'The passage explicitly states "three scripts".' },
  { text: '"Bees communicate the location of flowers through a waggle dance." What is the purpose of the waggle dance?', options: ['To attract a mate', 'To warn of danger', 'To show where flowers are', 'To celebrate'], correct: 2, explanation: 'The dance communicates the location of flower sources to other bees.' },

  // Synonyms
  { text: 'Which word is closest in meaning to HAPPY?', options: ['Sad', 'Elated', 'Angry', 'Tired'], correct: 1, explanation: 'Elated means extremely happy.' },
  { text: 'Which word is closest in meaning to QUICK?', options: ['Slow', 'Rapid', 'Heavy', 'Dull'], correct: 1, explanation: 'Rapid means fast/quick.' },
  { text: 'Which word is closest in meaning to CLEVER?', options: ['Foolish', 'Intelligent', 'Clumsy', 'Rude'], correct: 1, explanation: 'Intelligent means clever/smart.' },
  { text: 'Which word is closest in meaning to ENORMOUS?', options: ['Tiny', 'Vast', 'Average', 'Short'], correct: 1, explanation: 'Vast means extremely large, like enormous.' },
  { text: 'Which word is closest in meaning to ANGRY?', options: ['Calm', 'Furious', 'Happy', 'Bored'], correct: 1, explanation: 'Furious means very angry.' },
  { text: 'Which word is closest in meaning to BEAUTIFUL?', options: ['Ugly', 'Stunning', 'Plain', 'Dull'], correct: 1, explanation: 'Stunning means extremely beautiful.' },
  { text: 'Which word is closest in meaning to BRAVE?', options: ['Timid', 'Courageous', 'Weak', 'Shy'], correct: 1, explanation: 'Courageous means brave.' },
  { text: 'Which word is closest in meaning to SILENT?', options: ['Loud', 'Hushed', 'Noisy', 'Bold'], correct: 1, explanation: 'Hushed means very quiet/silent.' },
  { text: 'Which word is closest in meaning to DELICIOUS?', options: ['Bland', 'Scrumptious', 'Bitter', 'Sour'], correct: 1, explanation: 'Scrumptious means extremely delicious.' },
  { text: 'Which word is closest in meaning to FAMOUS?', options: ['Unknown', 'Renowned', 'Ordinary', 'Secret'], correct: 1, explanation: 'Renowned means widely famous.' },

  // Double-Meaning Words
  { text: 'Which word can mean both "a financial institution" and "the side of a river"?', options: ['Bank', 'Stream', 'Fund', 'Shore'], correct: 0, explanation: 'Bank means both a place to keep money and the edge of a river.' },
  { text: 'Which word can mean both "a round object to play with" and "a formal dance"?', options: ['Game', 'Ball', 'Ring', 'Party'], correct: 1, explanation: 'Ball means both a spherical toy and a grand dance event.' },
  { text: 'Which word can mean both "a light source" and "not heavy"?', options: ['Bright', 'Light', 'Lamp', 'Glow'], correct: 1, explanation: 'Light means both illumination and the opposite of heavy.' },
  { text: 'Which word can mean both "a flying creature" and "a piece of sports equipment"?', options: ['Bird', 'Bat', 'Fly', 'Racket'], correct: 1, explanation: 'Bat is both a nocturnal mammal and used in cricket/baseball.' },
  { text: 'Which word can mean both "to make a letter" and "a pleasant feeling"?', options: ['Write', 'Letter', 'Content', 'Note'], correct: 2, explanation: 'Content means both the substance of writing and a feeling of satisfaction.' },
  { text: 'Which word can mean both "a tree part" and "a storage container"?', options: ['Trunk', 'Branch', 'Log', 'Box'], correct: 0, explanation: 'Trunk is both the main stem of a tree and a large storage box.' },
  { text: 'Which word can mean both "to observe" and "a timepiece"?', options: ['See', 'Watch', 'Clock', 'Look'], correct: 1, explanation: 'Watch means both to look at something and a wrist timepiece.' },
  { text: 'Which word can mean both "the season" and "a coiled metal device"?', options: ['Fall', 'Spring', 'Winter', 'Coil'], correct: 1, explanation: 'Spring is both a season and a coiled elastic device.' },

  // Analogies
  { text: 'Puppy is to Dog as Kitten is to ___', options: ['Cat', 'Mouse', 'Rabbit', 'Hamster'], correct: 0, explanation: 'A puppy is a young dog; a kitten is a young cat.' },
  { text: 'Author is to Book as Artist is to ___', options: ['Gallery', 'Painting', 'Brush', 'Museum'], correct: 1, explanation: 'An author creates a book; an artist creates a painting.' },
  { text: 'Paw is to Cat as Hoof is to ___', options: ['Dog', 'Horse', 'Bird', 'Fish'], correct: 1, explanation: 'A cat has paws; a horse has hooves.' },
  { text: 'Bread is to Baker as Clothes are to ___', options: ['Shop', 'Tailor', 'Cotton', 'Iron'], correct: 1, explanation: 'A baker makes bread; a tailor makes clothes.' },
  { text: 'Ear is to Hear as Eye is to ___', options: ['Cry', 'Blink', 'See', 'Glasses'], correct: 2, explanation: 'Ears are for hearing; eyes are for seeing.' },
  { text: 'Ship is to Sea as Plane is to ___', options: ['Airport', 'Sky', 'Pilot', 'Wing'], correct: 1, explanation: 'A ship travels on the sea; a plane travels through the sky.' },
  { text: 'Chapter is to Book as Scene is to ___', options: ['Movie', 'Play', 'Act', 'Stage'], correct: 1, explanation: 'A book is divided into chapters; a play is divided into scenes.' },
  { text: 'Thermometer is to Temperature as Speedometer is to ___', options: ['Car', 'Speed', 'Distance', 'Fuel'], correct: 1, explanation: 'A thermometer measures temperature; a speedometer measures speed.' },
  { text: 'Calf is to Cow as Lamb is to ___', options: ['Goat', 'Sheep', 'Pig', 'Deer'], correct: 1, explanation: 'A calf is a young cow; a lamb is a young sheep.' },
  { text: 'Pencil is to Write as Knife is to ___', options: ['Sharp', 'Kitchen', 'Cut', 'Fork'], correct: 2, explanation: 'A pencil is used to write; a knife is used to cut.' },

  // Letter/Word Patterns
  { text: 'Rearrange the letters LISTEN to make another word:', options: ['SILENT', 'INLETS', 'TINSEL', 'All of these'], correct: 3, explanation: 'LISTEN can be rearranged to SILENT, INLETS, or TINSEL — all valid anagrams.' },
  { text: 'Rearrange the letters EARTH to make another word:', options: ['HEART', 'HEATH', 'RATHE', 'HATER'], correct: 0, explanation: 'EARTH rearranged gives HEART — both use E, A, R, T, H.' },
  { text: 'Rearrange the letters BELOW to make another word:', options: ['ELBOW', 'BOWEL', 'TOWEL', 'BLOWN'], correct: 0, explanation: 'BELOW rearranged gives ELBOW — both use B, E, L, O, W.' },
  { text: 'Rearrange the letters PLATES to make another word:', options: ['PETALS', 'STAPLE', 'PLEATS', 'All of these'], correct: 3, explanation: 'PLATES can become PETALS, STAPLE, or PLEATS — all use the same letters.' },
  { text: 'Rearrange the letters DANGER to make another word:', options: ['GARDEN', 'GANDER', 'RANGED', 'All of these'], correct: 3, explanation: 'DANGER can be rearranged to GARDEN, GANDER, or RANGED.' },

  // Code/Number Sequences
  { text: 'If CAT = 3-1-20 (A=1, B=2, ...), what does 4-15-7 spell?', options: ['DOG', 'COW', 'FOX', 'PIG'], correct: 0, explanation: 'D=4, O=15, G=7, spelling DOG.' },
  { text: 'In a code, FISH is written as GKUJ. What is BIRD in the same code?', options: ['CJSE', 'CKUE', 'CJTE', 'CKSE'], correct: 0, explanation: 'Each letter moves forward by 1,2,3,4: B+1=C, I+1=J, R+1=S, D+1=E → CJSE.' },
  { text: 'Complete the sequence: AB, CD, EF, GH, ?', options: ['IJ', 'HI', 'JK', 'IK'], correct: 0, explanation: 'Consecutive letter pairs: AB, CD, EF, GH, IJ.' },
  { text: 'If RED = 27, BED = 11, what does FED equal?', options: ['15', '19', '17', '21'], correct: 0, explanation: 'Using A=1..Z=26: R(18)+E(5)+D(4)=27, B(2)+E(5)+D(4)=11, F(6)+E(5)+D(4)=15.' },
  { text: 'What comes next: ZA, YB, XC, WD, ?', options: ['VE', 'UF', 'VF', 'UE'], correct: 0, explanation: 'First letter goes backwards (Z,Y,X,W,V), second goes forwards (A,B,C,D,E) → VE.' },
];

// ─── English 11+ GL-style questions (comprehension, grammar, vocabulary, cloze) ───
export const CONTENT_ENGLISH_11PLUS: Question[] = [
  // Grammar
  { text: 'Which sentence uses the correct form of "their/there/they\'re"?', options: ['Their going to the park.', 'There coats are on the hook.', 'They\'re coming to dinner tonight.', 'They\'re house is on the hill.'], correct: 2, explanation: '"They\'re" is a contraction of "they are" — They\'re coming to dinner tonight.' },
  { text: 'Choose the sentence with correct punctuation:', options: ['The boys\' football was lost in the park.', 'The boys football was lost in the park.', 'The boy\'s football was lost in the park', 'The boys football, was lost in the park.'], correct: 0, explanation: '"Boys\'" shows possession for multiple boys. The sentence also ends with a full stop.' },
  { text: 'Which word is an adverb in: "She ran quickly to the station"?', options: ['She', 'ran', 'quickly', 'station'], correct: 2, explanation: '"Quickly" describes how she ran — it modifies the verb, making it an adverb.' },
  { text: 'What type of word is "although" in: "Although it rained, we played outside"?', options: ['Noun', 'Adverb', 'Conjunction', 'Preposition'], correct: 2, explanation: '"Although" is a subordinating conjunction linking two clauses.' },
  { text: 'Which sentence is written in the passive voice?', options: ['The cat chased the mouse.', 'The mouse was chased by the cat.', 'A mouse ran across the floor.', 'The cat is very fast.'], correct: 1, explanation: 'In passive voice, the subject receives the action: "The mouse was chased."' },
  { text: 'Choose the correct sentence:', options: ['Me and Tom went shopping.', 'Tom and me went shopping.', 'Tom and I went shopping.', 'I and Tom went shopping.'], correct: 2, explanation: '"Tom and I" is correct as the subject. Test: "I went shopping" works; "Me went shopping" does not.' },
  { text: 'What is the plural of "sheep"?', options: ['Sheeps', 'Sheepes', 'Sheep', 'Sheepies'], correct: 2, explanation: '"Sheep" is an irregular noun — the plural is the same as the singular.' },
  { text: 'Which sentence contains a relative clause?', options: ['I like chocolate.', 'The dog, which was brown, barked loudly.', 'She ran fast.', 'We went home.'], correct: 1, explanation: '"Which was brown" is a relative clause giving extra information about the dog.' },

  // Vocabulary
  { text: 'What does "benevolent" mean?', options: ['Cruel', 'Kind and generous', 'Lazy', 'Frightened'], correct: 1, explanation: 'Benevolent means well-meaning, kind, and generous.' },
  { text: 'What does "reluctant" mean?', options: ['Eager', 'Unwilling or hesitant', 'Happy', 'Quick'], correct: 1, explanation: 'Reluctant means not willing or hesitant.' },
  { text: 'Which word means "to make something less severe"?', options: ['Aggravate', 'Mitigate', 'Complicate', 'Escalate'], correct: 1, explanation: 'Mitigate means to make less severe, serious, or painful.' },
  { text: 'What does "ambiguous" mean?', options: ['Clear', 'Open to more than one meaning', 'Loud', 'Beautiful'], correct: 1, explanation: 'Ambiguous means having more than one possible meaning; unclear.' },
  { text: 'What is a synonym for "courageous"?', options: ['Timid', 'Brave', 'Weak', 'Careful'], correct: 1, explanation: 'Courageous and brave both mean showing no fear of danger.' },

  // Comprehension & Cloze-style
  { text: 'Complete the sentence: The children were ___ because they had won the competition.', options: ['devastated', 'ecstatic', 'indifferent', 'anxious'], correct: 1, explanation: 'Ecstatic means extremely happy — fitting for winning a competition.' },
  { text: 'Complete: Despite the ___ weather, the hikers continued their journey.', options: ['pleasant', 'glorious', 'treacherous', 'mild'], correct: 2, explanation: '"Despite" signals contrast, so the weather must be bad — treacherous fits.' },
  { text: 'Complete: The old house had been ___ for years and was falling apart.', options: ['renovated', 'abandoned', 'decorated', 'inhabited'], correct: 1, explanation: 'Abandoned (left empty) explains why the house is falling apart.' },
  { text: 'Complete: The magician\'s trick was so ___ that the audience gasped in amazement.', options: ['boring', 'ordinary', 'spectacular', 'simple'], correct: 2, explanation: 'Spectacular means impressive enough to make an audience gasp.' },
  { text: 'Which word best completes: "The knight showed great ___ in battle"?', options: ['cowardice', 'valour', 'laziness', 'confusion'], correct: 1, explanation: 'Valour means great courage, especially in battle.' },

  // Spelling
  { text: 'Which word is spelled correctly?', options: ['Neccessary', 'Necessary', 'Neccesary', 'Necesary'], correct: 1, explanation: 'Necessary: one C, two S\'s — "one collar, two socks".' },
  { text: 'Which word is spelled correctly?', options: ['Seperate', 'Separete', 'Separate', 'Seperete'], correct: 2, explanation: 'Separate has "a rat" in the middle — sep-A-R-A-T-e.' },
  { text: 'Which word is spelled correctly?', options: ['Occassion', 'Ocassion', 'Occasion', 'Ocasion'], correct: 2, explanation: 'Occasion: two C\'s, one S.' },
  { text: 'Which word is spelled correctly?', options: ['Definately', 'Definatly', 'Definitely', 'Definitly'], correct: 2, explanation: 'Definitely contains "finite" — defINITEly.' },

  // Figurative Language
  { text: 'What type of figurative language is: "The wind howled through the trees"?', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correct: 2, explanation: 'The wind is given a human action (howling) — this is personification.' },
  { text: '"She was as busy as a bee." This is an example of:', options: ['Metaphor', 'Simile', 'Alliteration', 'Onomatopoeia'], correct: 1, explanation: 'Using "as...as" to compare makes this a simile.' },
  { text: '"Peter Piper picked a peck of pickled peppers." This is an example of:', options: ['Simile', 'Personification', 'Alliteration', 'Hyperbole'], correct: 2, explanation: 'The repetition of the "P" sound at the start of words is alliteration.' },
  { text: '"I\'ve told you a million times!" This is an example of:', options: ['Simile', 'Metaphor', 'Alliteration', 'Hyperbole'], correct: 3, explanation: 'Exaggeration for effect (not literally a million times) is hyperbole.' },
];

// ─── Non-Verbal Reasoning 11+ GL-style questions (text-based spatial/pattern) ───
export const CONTENT_NVR_11PLUS: Question[] = [
  // Rotations
  { text: 'If you rotate the letter "N" by 180 degrees, which letter does it look like?', options: ['Z', 'N', 'M', 'W'], correct: 1, explanation: 'N rotated 180 degrees still looks like N — it has rotational symmetry of order 2.' },
  { text: 'If you rotate the letter "Z" by 90 degrees clockwise, which letter does it resemble?', options: ['N', 'S', 'Z', 'L'], correct: 0, explanation: 'Z rotated 90 degrees clockwise resembles the letter N.' },
  { text: 'A shape is rotated 270 degrees clockwise. This is the same as rotating it how many degrees anti-clockwise?', options: ['90', '180', '270', '360'], correct: 0, explanation: '270 clockwise = 360 − 270 = 90 degrees anti-clockwise.' },
  { text: 'How many times does a square look the same when rotated through 360 degrees?', options: ['2', '4', '6', '8'], correct: 1, explanation: 'A square has rotational symmetry of order 4 (at 90, 180, 270, and 360 degrees).' },

  // Reflections
  { text: 'Which capital letter looks the same when reflected in a vertical mirror?', options: ['F', 'A', 'J', 'P'], correct: 1, explanation: 'A has a vertical line of symmetry, so it looks the same when reflected vertically.' },
  { text: 'Which of these letters looks different when reflected in a horizontal mirror?', options: ['O', 'X', 'F', 'H'], correct: 2, explanation: 'F does not have horizontal symmetry, so it changes when reflected horizontally.' },
  { text: 'If you reflect the number 3 in a vertical mirror, what does it look like?', options: ['E', '3', 'Reversed 3', 'W'], correct: 2, explanation: 'A reflected 3 appears backwards, like a reversed 3 (similar to the letter E).' },

  // Nets / 3D shapes
  { text: 'Which net folds into an open-top box (no lid)?', options: ['A cross shape of 5 squares', 'A T-shape of 6 squares', 'A cross shape of 6 squares', 'A line of 4 squares'], correct: 0, explanation: 'An open-top box has 5 faces (base + 4 sides), so a cross of 5 squares works.' },
  { text: 'A cube is painted red on all faces then cut into 27 small cubes. How many small cubes have exactly 2 red faces?', options: ['8', '12', '6', '1'], correct: 1, explanation: 'Edge cubes (not corners) have 2 painted faces. A 3×3×3 cube has 12 edge pieces.' },
  { text: 'A cube has dots on opposite faces that add up to 7. If 1 is on top, what is on the bottom?', options: ['2', '4', '6', '5'], correct: 2, explanation: 'Opposite faces sum to 7: 1+6=7, so 6 is on the bottom.' },
  { text: 'How many faces does a tetrahedron have?', options: ['3', '4', '5', '6'], correct: 1, explanation: 'A tetrahedron has 4 triangular faces.' },

  // Pattern Sequences
  { text: 'In a pattern, each shape gains one more side: triangle, square, pentagon. What comes after hexagon?', options: ['Octagon', 'Heptagon', 'Nonagon', 'Decagon'], correct: 1, explanation: 'Heptagon has 7 sides, following hexagon (6 sides).' },
  { text: 'A pattern alternates: black circle, white square, black circle, white square. What is the 7th shape?', options: ['White square', 'Black circle', 'White circle', 'Black square'], correct: 1, explanation: 'Odd positions (1st, 3rd, 5th, 7th) are black circles.' },
  { text: 'In a sequence, the shape rotates 45 degrees each step. After 4 steps, it has rotated by:', options: ['90°', '135°', '180°', '225°'], correct: 2, explanation: '4 steps × 45 degrees = 180 degrees total rotation.' },
  { text: 'A dot starts at the top of a square and moves one corner clockwise each step. After 6 steps, where is it?', options: ['Top', 'Right', 'Bottom', 'Left'], correct: 2, explanation: '6 steps around 4 corners: 6 mod 4 = 2 positions from top, which is the bottom.' },

  // Spatial Awareness
  { text: 'How many small squares make up a 4×4 grid?', options: ['8', '12', '16', '20'], correct: 2, explanation: '4 × 4 = 16 small squares.' },
  { text: 'A shape has 3 lines of symmetry. Which shape could it be?', options: ['Rectangle', 'Equilateral triangle', 'Parallelogram', 'Right triangle'], correct: 1, explanation: 'An equilateral triangle has exactly 3 lines of symmetry.' },
  { text: 'If you fold a piece of paper in half twice and punch a hole, how many holes appear when unfolded?', options: ['1', '2', '3', '4'], correct: 3, explanation: 'Folding in half twice creates 4 layers, so one punch makes 4 holes.' },
  { text: 'Looking at a cube from directly above, what 2D shape do you see?', options: ['Rectangle', 'Triangle', 'Square', 'Hexagon'], correct: 2, explanation: 'A cube viewed from directly above appears as a square (the top face).' },
  { text: 'A figure is made of 5 unit cubes in an L-shape. How many unit squares are visible from the front?', options: ['3', '4', '5', '6'], correct: 2, explanation: 'An L-shape made of 5 cubes shows 5 visible square faces from the front.' },

  // Matrices / Completing Patterns
  { text: 'In a 3×3 grid, each row has a circle, triangle, and square. Row 3 has a circle and triangle. What is missing?', options: ['Circle', 'Triangle', 'Square', 'Pentagon'], correct: 2, explanation: 'Each row must contain all three shapes. Circle and triangle are present, so square is missing.' },
  { text: 'In a pattern grid, shapes get smaller left to right and darker top to bottom. What goes in the bottom-right?', options: ['Large light shape', 'Small light shape', 'Large dark shape', 'Small dark shape'], correct: 3, explanation: 'Bottom-right combines smallest (right) and darkest (bottom) = small dark shape.' },
  { text: 'A 2×2 grid shows: top-left has 1 dot, top-right has 2 dots, bottom-left has 2 dots. How many dots in bottom-right?', options: ['1', '2', '3', '4'], correct: 3, explanation: 'Pattern: each row/column sums consistently. 1+2=3 top, so bottom needs 2+?=4 to continue the pattern; bottom-right = 4.' },
];
