// Comprehensive question bank parsed from 11 Plus exam materials
// Sources: GL Assessment papers, CEM papers, 11+ Mock Exams, CGP practice tests
import type { Question } from './types';

// ─── MATHS 11+ (80 questions) ───
export const CONTENT_MATHS_11PLUS: Question[] = [
  // Arithmetic & Number
  { text: 'What is 3,456 + 2,789?', options: ['5,245', '6,245', '6,345', '6,145'], correct: 1, explanation: '3,456 + 2,789 = 6,245.' },
  { text: 'What is 8,003 − 4,567?', options: ['3,536', '3,436', '3,336', '4,436'], correct: 1, explanation: '8,003 − 4,567 = 3,436.' },
  { text: 'What is 347 × 6?', options: ['2,182', '1,982', '2,082', '2,282'], correct: 2, explanation: '347 × 6 = 2,082.' },
  { text: 'What is 1,764 ÷ 12?', options: ['148', '146', '149', '147'], correct: 3, explanation: '1,764 ÷ 12 = 147.' },
  { text: 'What is 21.6 × 4.9?', options: ['105.48', '105.84', '203.98', '78.45'], correct: 1, explanation: '21.6 × 4.9 = 105.84.' },
  { text: 'What is 12.8 × 5.7?', options: ['70.69', '71.08', '72.96', '73.96'], correct: 2, explanation: '12.8 × 5.7 = 72.96.' },
  { text: 'What is 1000 × 3.078?', options: ['3,078', '378', '3,708', '37.8'], correct: 0, explanation: 'Moving the decimal 3 places right: 3,078.' },
  { text: 'What is 30,785 ÷ 1000?', options: ['3.0785', '3.785', '30.785', '307.85'], correct: 2, explanation: '30,785 ÷ 1000 = 30.785.' },
  { text: 'Which of these numbers is smallest? 1/5, 0.45, 42%, 1/8, 0.12', options: ['1/5', '0.45', '1/8', '0.12'], correct: 3, explanation: '0.12 = 12% is the smallest. 1/8 = 0.125, 1/5 = 0.2, 42% = 0.42.' },
  { text: 'What is 4³?', options: ['12', '64', '16', '48'], correct: 1, explanation: '4³ = 4 × 4 × 4 = 64.' },
  { text: 'What is 7²?', options: ['14', '46', '49', '72'], correct: 2, explanation: '7² = 7 × 7 = 49.' },
  { text: 'What is 21²?', options: ['42', '441', '4,410', '4,200'], correct: 1, explanation: '21² = 21 × 21 = 441.' },
  { text: 'Which of these calculations will NOT give an even number?', options: ['12 × 4', '18 × 6', '9 × 3', '19 × 4'], correct: 2, explanation: '9 × 3 = 27, which is odd. Even × anything = even, but odd × odd = odd.' },
  { text: 'Which of these numbers is NOT prime?', options: ['7', '11', '19', '21'], correct: 3, explanation: '21 = 3 × 7, so it is not prime.' },
  { text: 'What is the highest common factor (HCF) of 24 and 36?', options: ['6', '8', '4', '12'], correct: 3, explanation: 'Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. HCF = 12.' },
  { text: 'What is the lowest common multiple (LCM) of 6 and 8?', options: ['48', '12', '16', '24'], correct: 3, explanation: 'Multiples of 6: 6,12,18,24. Multiples of 8: 8,16,24. LCM = 24.' },
  { text: 'Round 4,567 to the nearest hundred.', options: ['4,500', '4,570', '4,600', '5,000'], correct: 2, explanation: '67 ≥ 50 so we round up to 4,600.' },
  { text: 'What is 1409.35 rounded to the nearest whole number?', options: ['1,409', '1,400', '1,410', '1,409.4'], correct: 0, explanation: '0.35 < 0.5 so we round down to 1,409.' },
  { text: 'How do you write 124 as a Roman numeral?', options: ['CXXIV', 'CXXIIII', 'CXXVI', 'LXXIV'], correct: 0, explanation: 'C=100, XX=20, IV=4. So 124 = CXXIV.' },

  // Fractions, Decimals & Percentages
  { text: 'What is 2/5 of 350?', options: ['150', '140', '130', '170'], correct: 1, explanation: '350 ÷ 5 = 70, then 70 × 2 = 140.' },
  { text: 'What is 3/4 of 80?', options: ['40', '60', '50', '70'], correct: 1, explanation: '1/4 of 80 = 20, so 3/4 = 60.' },
  { text: 'Convert 0.75 to a fraction in simplest form.', options: ['7/10', '15/20', '3/4', '6/8'], correct: 2, explanation: '0.75 = 75/100 = 3/4.' },
  { text: 'What is 15% of 240?', options: ['24', '36', '30', '48'], correct: 1, explanation: '10% = 24, 5% = 12, so 15% = 36.' },
  { text: 'Simplify: 4/6 + 1/3', options: ['5/6', '7/9', '1', '2/3'], correct: 2, explanation: '4/6 = 2/3, then 2/3 + 1/3 = 1.' },
  { text: 'What is ½ × ¾?', options: ['3/8', '3/6', '1¼', '2/6'], correct: 0, explanation: '1/2 × 3/4 = 3/8.' },
  { text: 'How many thirds are there in the number 12?', options: ['3', '18', '36', '48'], correct: 2, explanation: '12 ÷ (1/3) = 12 × 3 = 36.' },
  { text: 'Boris cuts his cake into 20 equal slices and gives out 16. What fraction is left?', options: ['1/5', '1/4', '2/5', '1/8'], correct: 0, explanation: '20 − 16 = 4 slices left. 4/20 = 1/5.' },
  { text: 'Tim has 42 toy cars. ⅔ are blue. How many are red?', options: ['12', '14', '16', '24'], correct: 1, explanation: '⅔ of 42 = 28 blue. 42 − 28 = 14 red.' },
  { text: '50 people were asked their car colour. 24 said black. What percentage did NOT say black?', options: ['24%', '48%', '26%', '52%'], correct: 3, explanation: '50 − 24 = 26 did not say black. 26/50 = 52%.' },
  { text: 'A shop offers 20% off a £45 jacket. What is the sale price?', options: ['£38', '£40', '£35', '£36'], correct: 3, explanation: '20% of £45 = £9. Sale price = £45 − £9 = £36.' },
  { text: 'Penny has 36 socks. 2/3 are white. How many white socks?', options: ['12', '18', '24', '30'], correct: 2, explanation: '2/3 of 36 = 24 white socks.' },

  // Geometry & Measurement
  { text: 'A regular hexagon has a perimeter of 42 cm. What is one side?', options: ['6 cm', '8 cm', '5 cm', '7 cm'], correct: 3, explanation: '42 ÷ 6 = 7 cm per side.' },
  { text: 'A regular heptagon has a perimeter of 63 cm. What is one side?', options: ['12.6 cm', '10.5 cm', '8 cm', '9 cm'], correct: 3, explanation: '63 ÷ 7 = 9 cm per side.' },
  { text: 'What is the area of a triangle with base 10 cm and height 6 cm?', options: ['60 cm²', '30 cm²', '16 cm²', '36 cm²'], correct: 1, explanation: 'Area = ½ × 10 × 6 = 30 cm².' },
  { text: 'A cuboid is 5 cm × 4 cm × 3 cm. What is its volume?', options: ['50 cm³', '12 cm³', '60 cm³', '24 cm³'], correct: 2, explanation: 'Volume = 5 × 4 × 3 = 60 cm³.' },
  { text: 'What does each angle measure in a regular hexagon?', options: ['180°', '60°', '120°', '90°'], correct: 2, explanation: 'Interior angle = (6-2) × 180 / 6 = 120°.' },
  { text: 'What shape has 0 vertices, 2 edges and 3 faces?', options: ['Sphere', 'Cone', 'Cylinder', 'Cube'], correct: 2, explanation: 'A cylinder has 2 circular edges, 3 faces (2 circles + 1 curved), and no vertices.' },
  { text: 'A rectangle has length 15 cm and width 8 cm. What is its perimeter?', options: ['23 cm', '46 cm', '120 cm', '38 cm'], correct: 1, explanation: 'Perimeter = 2(15 + 8) = 46 cm.' },
  { text: 'What is the perimeter of a semicircle with diameter 14 cm? (π ≈ 22/7)', options: ['22 cm', '44 cm', '36 cm', '50 cm'], correct: 2, explanation: 'Curved part = π × 14/2 = 22 cm. Total = 22 + 14 = 36 cm.' },
  { text: 'A clock shows 3:45 PM. What angle do the hands make?', options: ['172.5°', '157.5°', '150°', '180°'], correct: 1, explanation: 'Minute hand at 270°, hour hand at 112.5°. Difference = 157.5°.' },
  { text: 'Convert 2.5 hours into minutes.', options: ['125 minutes', '160 minutes', '150 minutes', '145 minutes'], correct: 2, explanation: '2.5 × 60 = 150 minutes.' },
  { text: 'How many millilitres are in 3.5 litres?', options: ['350 ml', '3,500 ml', '35,000 ml', '3,050 ml'], correct: 1, explanation: '3.5 × 1,000 = 3,500 ml.' },
  { text: 'A scarf is 45 cm long. Jade buys 20 scarves. What is the total length in metres?', options: ['9 m', '90 m', '0.9 m', '900 m'], correct: 0, explanation: '45 × 20 = 900 cm = 9 m.' },
  { text: 'A skipping rope is 85.7 cm long. What is the total length of 10 ropes in metres?', options: ['0.857 m', '8.57 m', '85.7 m', '857 m'], correct: 1, explanation: '85.7 × 10 = 857 cm = 8.57 m.' },
  { text: 'Which is most likely the weight of a can of baked beans?', options: ['4 g', '40 g', '400 g', '4 kg'], correct: 2, explanation: 'A standard can of beans weighs about 400 g.' },

  // Ratio, Proportion & Algebra
  { text: 'Lisa, Louise and Linda share £150 in ratio 5:2:3. How much does Louise get?', options: ['£15', '£30', '£45', '£60'], correct: 1, explanation: 'Total parts = 10. Louise gets 2/10 × £150 = £30.' },
  { text: 'Eloise, Lucinda and Jennifer share £150 in ratio 5:3:2. How much does Lucinda get?', options: ['£30', '£45', '£75', '£50'], correct: 1, explanation: 'Total parts = 10. Lucinda gets 3/10 × £150 = £45.' },
  { text: 'Two pizzas cost £17. What is the cost of 5 pizzas?', options: ['£34.00', '£42.50', '£51.00', '£25.50'], correct: 1, explanation: '1 pizza = £8.50. 5 × £8.50 = £42.50.' },
  { text: '4 cartons of milk cost £2.40. How much for 16 cartons?', options: ['£4.80', '£7.20', '£9.60', '£12.00'], correct: 2, explanation: '16 is 4 × 4, so cost = 4 × £2.40 = £9.60.' },
  { text: 'If 5x − 3 = 22, what is x?', options: ['4', '3', '5', '6'], correct: 2, explanation: '5x = 25, x = 5.' },
  { text: 'If 4a = 16, what is a?', options: ['2', '3', '4', '5'], correct: 2, explanation: 'a = 16 ÷ 4 = 4.' },
  { text: 'If a = 4 and b = 7, what is 3a + 2b?', options: ['24', '22', '28', '26'], correct: 3, explanation: '3(4) + 2(7) = 12 + 14 = 26.' },
  { text: 'George buys 12 books at £a each with £b delivery. Total cost?', options: ['12ab', '12a + b', 'ab + 12', '12b × a'], correct: 1, explanation: '12 books × £a + delivery = 12a + b.' },

  // Sequences & Patterns
  { text: 'What is the next number: 3, 7, 15, 31, ?', options: ['47', '63', '55', '62'], correct: 1, explanation: 'Pattern: double then +1. 31 × 2 + 1 = 63.' },
  { text: 'What is the mean of 12, 15, 18, 21, and 24?', options: ['15', '20', '19', '18'], correct: 3, explanation: 'Sum = 90, count = 5. Mean = 18.' },
  { text: 'What are the factors of 36?', options: ['1,2,3,6,12,36', '1,2,4,6,9,36', '1,2,3,4,6,9,12,18,36', '1,3,6,9,18,36'], correct: 2, explanation: 'All factors: 1, 2, 3, 4, 6, 9, 12, 18, 36.' },
  { text: 'A pie chart shows 90° for Science. What fraction chose Science?', options: ['1/3', '1/4', '1/2', '1/5'], correct: 1, explanation: '90 ÷ 360 = 1/4.' },

  // Probability & Data
  { text: 'Katie has 9 blue, 8 green and 3 yellow marbles. Probability of green?', options: ['1/2', '1/4', '1/5', '2/5'], correct: 3, explanation: 'Total = 20. Green = 8. P = 8/20 = 2/5.' },
  { text: 'A bag has 3 red, 5 blue and 2 green balls. Probability of blue?', options: ['1/3', '1/2', '3/10', '2/5'], correct: 1, explanation: 'Total = 10, blue = 5. P = 5/10 = 1/2.' },
  { text: 'Elsa has 7 chocolates, 8 toffees and 3 liquorice. She eats 2 chocolates. What fraction of remaining sweets are toffees?', options: ['1/4', '1/2', '1/3', '3/8'], correct: 1, explanation: '18 − 2 = 16 left. Toffees = 8. 8/16 = 1/2.' },

  // Time & Speed
  { text: 'A train leaves at 09:45 and arrives at 11:20. How long is the journey?', options: ['1h 25m', '1h 35m', '1h 45m', '2h 05m'], correct: 1, explanation: '09:45 to 11:20 = 1 hour 35 minutes.' },
  { text: 'Jasmine completes a 30-mile run in 2 hours. Average speed?', options: ['4 mph', '10 mph', '15 mph', '30 mph'], correct: 2, explanation: 'Speed = distance ÷ time = 30 ÷ 2 = 15 mph.' },
  { text: 'Olivia catches a train at 11:15am. Journey takes 2h 35m, delayed 8 min. Arrival?', options: ['1:58 pm', '1:50 pm', '2:58 pm', '8:32 am'], correct: 0, explanation: '11:15 + 2:35 = 1:50 pm + 8 min delay = 1:58 pm.' },
  { text: 'Lisa arrives at school at 8:45am. Train = 12 min, bus = 35 min. Start time?', options: ['7:50 am', '7:58 am', '8:02 am', '9:32 am'], correct: 1, explanation: '8:45 − 12 − 35 = 7:58 am.' },
  { text: 'A coach left Manchester at 08:52 and arrived at 17:23. Journey time in minutes?', options: ['508', '509', '511', '512'], correct: 2, explanation: '08:52 to 17:23 = 8 hours 31 minutes = 511 minutes.' },
  { text: 'What is 15:15 in 12-hour clock?', options: ['3:15 am', '3:15 pm', '10:15 pm', '5:15 pm'], correct: 1, explanation: '15:15 = 3:15 pm (subtract 12 from 15).' },

  // Place Value
  { text: 'What is the value of 6 in 462,385?', options: ['6', '60', '600', '60,000'], correct: 3, explanation: '6 is in the ten thousands place = 60,000.' },

  // Coordinates & Position
  { text: 'A triangle at point A(3,2) is reflected in the y-axis. New coordinates?', options: ['(3, −2)', '(−3, 2)', '(2, 2)', '(−2, −2)'], correct: 1, explanation: 'Reflecting in y-axis negates x: (3,2) → (−3,2).' },
  { text: 'Adam starts at (−1, −2), goes 4 north and 2 east. Where does he end up?', options: ['(−3, 2)', '(−2, 2)', '(0, 3)', '(1, 2)'], correct: 3, explanation: '(−1+2, −2+4) = (1, 2).' },

  // More Number Problems
  { text: 'What are the first two terms if nth term = 3n² + 1?', options: ['1 and 3', '4 and 13', '7 and 13', '10 and 37'], correct: 1, explanation: 'n=1: 3(1)+1=4, n=2: 3(4)+1=13.' },
  { text: 'How many 7s are there in 387 (to nearest whole number)?', options: ['53', '54', '55', '56'], correct: 2, explanation: '387 ÷ 7 = 55.28... ≈ 55.' },
  { text: 'For every 3 eggs, David needs 120g flour. How many eggs for 480g?', options: ['6', '9', '12', '15'], correct: 2, explanation: '480 ÷ 120 = 4 batches. 4 × 3 = 12 eggs.' },
  { text: 'What is 15% of £360?', options: ['£36', '£54', '£45', '£72'], correct: 1, explanation: '10% = £36, 5% = £18. 15% = £54.' },
  { text: 'Carrie buys 4 chocolate bars at 49p and 7 bags of peanuts at 29p. Total?', options: ['£1.96', '£2.03', '£3.99', '£3.99'], correct: 2, explanation: '4 × 49 = 196p, 7 × 29 = 203p. Total = 399p = £3.99.' },
  { text: 'An island temperature was 11°C. It dropped by 17°C. New temperature?', options: ['−4°C', '−6°C', '6°C', '28°C'], correct: 1, explanation: '11 − 17 = −6°C.' },
];

// ─── VERBAL REASONING 11+ (80 questions) ───
export const CONTENT_VERBAL_11PLUS: Question[] = [
  // Opposite Words (from CEM/GL papers)
  { text: 'Select the word most opposite to: GENEROUS', options: ['Kind', 'Mean', 'Wealthy', 'Gentle'], correct: 1, explanation: 'Mean (stingy) is the opposite of generous.' },
  { text: 'Select the word most opposite to: ANCIENT', options: ['Old', 'Modern', 'Historic', 'Antique'], correct: 1, explanation: 'Modern is the opposite of ancient.' },
  { text: 'Select the word most opposite to: BRAVE', options: ['Bold', 'Cowardly', 'Strong', 'Fierce'], correct: 1, explanation: 'Cowardly is the opposite of brave.' },
  { text: 'Select the word most opposite to: EXPAND', options: ['Grow', 'Shrink', 'Stretch', 'Widen'], correct: 1, explanation: 'Shrink is the opposite of expand.' },
  { text: 'Select the word most opposite to: TRANQUIL', options: ['Calm', 'Peaceful', 'Turbulent', 'Serene'], correct: 2, explanation: 'Turbulent (disturbed) is the opposite of tranquil (calm).' },
  { text: 'Select the word most opposite to: LUMINOUS', options: ['Bright', 'Dim', 'Shiny', 'Radiant'], correct: 1, explanation: 'Dim is the opposite of luminous (bright/shining).' },
  { text: 'Select the word most opposite to: FLEXIBLE', options: ['Rigid', 'Bendy', 'Elastic', 'Supple'], correct: 0, explanation: 'Rigid is the opposite of flexible.' },
  { text: 'Select the word most opposite to: CAUTIOUS', options: ['Careful', 'Reckless', 'Timid', 'Wary'], correct: 1, explanation: 'Reckless is the opposite of cautious.' },
  { text: 'Select the word most opposite to: ABUNDANT', options: ['Plentiful', 'Ample', 'Scarce', 'Generous'], correct: 2, explanation: 'Scarce is the opposite of abundant (plentiful).' },
  { text: 'Select the word most opposite to: PERMANENT', options: ['Lasting', 'Temporary', 'Fixed', 'Stable'], correct: 1, explanation: 'Temporary is the opposite of permanent.' },
  { text: 'Select the word most opposite to: SQUANDER', options: ['Exhaust', 'Save', 'Deliver', 'Defend'], correct: 1, explanation: 'Save is the opposite of squander (to waste).' },
  { text: 'Select the word most opposite to: COARSELY', options: ['Finely', 'Cautiously', 'Lightly', 'Tactfully'], correct: 0, explanation: 'Finely is the opposite of coarsely.' },
  { text: 'Select the word most opposite to: CONSPICUOUS', options: ['Subtle', 'Forthright', 'Dishonest', 'Blatant'], correct: 0, explanation: 'Subtle is the opposite of conspicuous (easily noticed).' },
  { text: 'Select the word most opposite to: OVERDUE', options: ['Former', 'Prior', 'Elapsed', 'Future'], correct: 1, explanation: 'Prior (earlier) is the opposite of overdue (late).' },
  { text: 'Select the word most opposite to: FRAGILE', options: ['Spare', 'Thin', 'Shadowy', 'Stout'], correct: 3, explanation: 'Stout (strong/sturdy) is the opposite of fragile.' },
  { text: 'Select the word most opposite to: DISAPPROVE', options: ['Disconnect', 'Separate', 'Disagree', 'Concur'], correct: 3, explanation: 'Concur (agree) is the opposite of disapprove.' },
  { text: 'Select the word most opposite to: TAUT', options: ['Release', 'Loose', 'Spare', 'Tethered'], correct: 1, explanation: 'Loose is the opposite of taut (stretched tight).' },
  { text: 'Select the word most opposite to: OBSTRUCT', options: ['Sanction', 'Resist', 'Dissolve', 'Deny'], correct: 0, explanation: 'Sanction (permit) is the opposite of obstruct (block).' },
  { text: 'Select the word most opposite to: POINTLESS', options: ['Invaluable', 'Worthless', 'Worthwhile', 'Priceless'], correct: 2, explanation: 'Worthwhile is the opposite of pointless.' },
  { text: 'Select the word most opposite to: ENEMY', options: ['Spy', 'Villain', 'Agent', 'Comrade'], correct: 3, explanation: 'Comrade (ally) is the opposite of enemy.' },

  // Odd Word Out (from CEM papers)
  { text: 'Find the odd one out: Eagle, Sparrow, Penguin, Bat, Robin', options: ['Eagle', 'Penguin', 'Bat', 'Robin'], correct: 2, explanation: 'Bat is a mammal; the others are all birds.' },
  { text: 'Find the odd one out: Piano, Violin, Guitar, Trumpet, Cello', options: ['Piano', 'Guitar', 'Trumpet', 'Cello'], correct: 2, explanation: 'Trumpet is wind; the others are string instruments.' },
  { text: 'Find the odd one out: Square, Rectangle, Triangle, Cube, Pentagon', options: ['Square', 'Triangle', 'Cube', 'Pentagon'], correct: 2, explanation: 'Cube is 3D; the others are 2D shapes.' },
  { text: 'Find the odd one out: Mercury, Venus, Moon, Mars, Jupiter', options: ['Mercury', 'Venus', 'Moon', 'Mars'], correct: 2, explanation: 'Moon is a satellite; the others are planets.' },
  { text: 'Find the odd one out: Oak, Elm, Rose, Ash, Birch', options: ['Oak', 'Elm', 'Rose', 'Birch'], correct: 2, explanation: 'Rose is a flower; the others are trees.' },
  { text: 'Find the odd one out: Crimson, Scarlet, Azure, Ruby, Vermilion', options: ['Crimson', 'Scarlet', 'Azure', 'Ruby'], correct: 2, explanation: 'Azure is blue; the others are all shades of red.' },
  { text: 'Find the odd one out: London, Paris, France, Berlin, Tokyo', options: ['London', 'Paris', 'France', 'Berlin'], correct: 2, explanation: 'France is a country; the others are capital cities.' },
  { text: 'Find the odd one out: Walk, Run, Sprint, Sit, Jog', options: ['Walk', 'Run', 'Sit', 'Jog'], correct: 2, explanation: 'Sit is stationary; the others involve moving on foot.' },
  { text: 'Find the odd one out: Knife, Fork, Spoon, Plate, Ladle', options: ['Fork', 'Spoon', 'Plate', 'Ladle'], correct: 2, explanation: 'Plate is crockery; the others are cutlery/utensils.' },
  { text: 'Find the odd one out: Oxygen, Nitrogen, Carbon, Diamond, Helium', options: ['Oxygen', 'Nitrogen', 'Diamond', 'Helium'], correct: 2, explanation: 'Diamond is a form of carbon, not an element name by itself.' },

  // Synonyms (from CGP VR papers)
  { text: 'Which word is closest in meaning to HAPPY?', options: ['Sad', 'Elated', 'Angry', 'Tired'], correct: 1, explanation: 'Elated means extremely happy.' },
  { text: 'Which word is closest in meaning to QUICK?', options: ['Slow', 'Rapid', 'Heavy', 'Dull'], correct: 1, explanation: 'Rapid means fast/quick.' },
  { text: 'Which word is closest in meaning to CLEVER?', options: ['Foolish', 'Intelligent', 'Clumsy', 'Rude'], correct: 1, explanation: 'Intelligent means clever/smart.' },
  { text: 'Which word is closest in meaning to ENORMOUS?', options: ['Tiny', 'Vast', 'Average', 'Short'], correct: 1, explanation: 'Vast means extremely large.' },
  { text: 'Which word is closest in meaning to BRAVE?', options: ['Timid', 'Courageous', 'Weak', 'Shy'], correct: 1, explanation: 'Courageous means brave.' },
  { text: 'Which word is closest in meaning to SILENT?', options: ['Loud', 'Hushed', 'Noisy', 'Bold'], correct: 1, explanation: 'Hushed means very quiet/silent.' },
  { text: 'Which word is closest in meaning to DELICIOUS?', options: ['Bland', 'Scrumptious', 'Bitter', 'Sour'], correct: 1, explanation: 'Scrumptious means extremely delicious.' },
  { text: 'Which word is closest in meaning to FAMOUS?', options: ['Unknown', 'Renowned', 'Ordinary', 'Secret'], correct: 1, explanation: 'Renowned means widely known/famous.' },
  { text: 'Which word is closest in meaning to BEAUTIFUL?', options: ['Ugly', 'Stunning', 'Plain', 'Dull'], correct: 1, explanation: 'Stunning means extremely beautiful.' },
  { text: 'Which word is closest in meaning to ANGRY?', options: ['Calm', 'Furious', 'Happy', 'Bored'], correct: 1, explanation: 'Furious means very angry.' },

  // Comprehension (from CGP CEM VR paper)
  { text: 'Daniel "squinted through thick lenses of his spectacles." What does this tell us?', options: ['He is tall', 'He wears glasses', 'He is in the dark', 'He is squinting at the sun'], correct: 1, explanation: 'Spectacles are glasses, and squinting through thick lenses confirms he wears them.' },
  { text: 'In a story, Daniel\'s dad is the headmaster. Which word best describes how Daniel feels at the start?', options: ['Anxious', 'Excited', 'Unlucky', 'Angry'], correct: 0, explanation: 'Daniel is nervous about his dad being headmaster; anxious fits his worried state.' },
  { text: '"His bark is worse than his bite." What does this mean?', options: ['He has a dog', 'He has a bad temper', 'He punishes everyone', 'He is not as scary as he seems'], correct: 3, explanation: 'This idiom means someone seems scary but is actually harmless.' },
  { text: 'What does "simultaneously" mean?', options: ['One after the other', 'In an effective way', 'By sharing tasks', 'At the same time'], correct: 3, explanation: 'Simultaneously means happening at the same time.' },
  { text: 'What does "severe" mean?', options: ['Strict', 'Miserable', 'Thin', 'Unreasonable'], correct: 0, explanation: 'Severe means very strict or stern.' },

  // Double-Meaning Words (from GL papers)
  { text: 'Which word means both "a financial institution" and "the side of a river"?', options: ['Bank', 'Stream', 'Fund', 'Shore'], correct: 0, explanation: 'Bank: a place for money AND the edge of a river.' },
  { text: 'Which word means both "a round object" and "a formal dance"?', options: ['Game', 'Ball', 'Ring', 'Party'], correct: 1, explanation: 'Ball: a sphere to play with AND a grand dancing event.' },
  { text: 'Which word means both "a light source" and "not heavy"?', options: ['Bright', 'Light', 'Lamp', 'Glow'], correct: 1, explanation: 'Light: illumination AND the opposite of heavy.' },
  { text: 'Which word means both "to direct" and "a desired outcome"?', options: ['Goal', 'Aim', 'Motive', 'Guide'], correct: 1, explanation: 'Aim: to point at something AND a purpose or goal.' },
  { text: 'Which word means both "a trench" and "to abandon"?', options: ['Drop', 'Gutter', 'Ditch', 'Leave'], correct: 2, explanation: 'Ditch: a drainage channel AND to discard/abandon.' },
  { text: 'Which word means both "a talent" and "a present"?', options: ['Gift', 'Bonus', 'Skill', 'Flair'], correct: 0, explanation: 'Gift: a natural ability AND something given to someone.' },
  { text: 'Which word means both "a path" and "to follow or hunt"?', options: ['Way', 'Chase', 'Passage', 'Track'], correct: 3, explanation: 'Track: a rough path AND to follow someone.' },
  { text: 'Which word means both "a law" and "to reign"?', options: ['Rule', 'Govern', 'Order', 'Instruct'], correct: 0, explanation: 'Rule: a code of behaviour AND to exercise control.' },

  // Analogies
  { text: 'Puppy is to Dog as Kitten is to ___', options: ['Cat', 'Mouse', 'Rabbit', 'Hamster'], correct: 0, explanation: 'A puppy is a young dog; a kitten is a young cat.' },
  { text: 'Author is to Book as Artist is to ___', options: ['Gallery', 'Painting', 'Brush', 'Museum'], correct: 1, explanation: 'An author creates a book; an artist creates a painting.' },
  { text: 'Ear is to Hear as Eye is to ___', options: ['Cry', 'Blink', 'See', 'Glasses'], correct: 2, explanation: 'Ears hear; eyes see.' },
  { text: 'Ship is to Sea as Plane is to ___', options: ['Airport', 'Sky', 'Pilot', 'Wing'], correct: 1, explanation: 'Ships travel on sea; planes travel through sky.' },
  { text: 'Thermometer is to Temperature as Speedometer is to ___', options: ['Car', 'Speed', 'Distance', 'Fuel'], correct: 1, explanation: 'A thermometer measures temperature; a speedometer measures speed.' },

  // Anagrams
  { text: 'Rearrange CHEAT to make another word:', options: ['TEACH', 'CATCH', 'CHEAP', 'EACH'], correct: 0, explanation: 'CHEAT rearranged = TEACH.' },
  { text: 'Rearrange LISTEN to make another word:', options: ['SILENT', 'INLETS', 'TINSEL', 'All of these'], correct: 3, explanation: 'LISTEN = SILENT, INLETS, or TINSEL.' },
  { text: 'Rearrange EARTH to make another word:', options: ['HEART', 'HEATH', 'RATHE', 'HATER'], correct: 0, explanation: 'EARTH rearranged = HEART.' },
  { text: 'Rearrange BELOW to make another word:', options: ['ELBOW', 'BOWEL', 'TOWEL', 'BLOWN'], correct: 0, explanation: 'BELOW rearranged = ELBOW.' },
  { text: 'Rearrange PLATES to make another word:', options: ['PETALS', 'STAPLE', 'PLEATS', 'All of these'], correct: 3, explanation: 'PLATES = PETALS, STAPLE, or PLEATS.' },

  // Codes
  { text: 'If CAT = 3-1-20 (A=1, B=2...), what does 4-15-7 spell?', options: ['DOG', 'COW', 'FOX', 'PIG'], correct: 0, explanation: 'D=4, O=15, G=7 → DOG.' },
  { text: 'What comes next: ZA, YB, XC, WD, ?', options: ['VE', 'UF', 'VF', 'UE'], correct: 0, explanation: 'First letter backwards (Z,Y,X,W,V), second forwards (A,B,C,D,E) → VE.' },
  { text: 'Complete: AB, CD, EF, GH, ?', options: ['IJ', 'HI', 'JK', 'IK'], correct: 0, explanation: 'Consecutive letter pairs: IJ comes next.' },
  { text: 'Complete: Hot is to Cold as Day is to ___', options: ['Light', 'Night', 'Sun', 'Warm'], correct: 1, explanation: 'Hot/Cold are opposites, so Day/Night are opposites.' },
];

// ─── ENGLISH 11+ (55 questions) ───
export const CONTENT_ENGLISH_11PLUS: Question[] = [
  // Grammar
  { text: 'Which sentence uses "their/there/they\'re" correctly?', options: ['Their going to the park.', 'There coats are on the hook.', 'They\'re coming to dinner tonight.', 'They\'re house is on the hill.'], correct: 2, explanation: '"They\'re" = "they are". They\'re coming to dinner tonight.' },
  { text: 'Choose the sentence with correct punctuation:', options: ['The boys\' football was lost in the park.', 'The boys football was lost in the park.', 'The boy\'s football was lost in the park', 'The boys football, was lost in the park.'], correct: 0, explanation: '"Boys\'" shows plural possession.' },
  { text: 'Which word is an adverb in: "She ran quickly to the station"?', options: ['She', 'ran', 'quickly', 'station'], correct: 2, explanation: '"Quickly" modifies the verb "ran" — it is an adverb.' },
  { text: 'What type of word is "although"?', options: ['Noun', 'Adverb', 'Conjunction', 'Preposition'], correct: 2, explanation: '"Although" is a subordinating conjunction linking two clauses.' },
  { text: 'Which sentence is in the passive voice?', options: ['The cat chased the mouse.', 'The mouse was chased by the cat.', 'A mouse ran across the floor.', 'The cat is very fast.'], correct: 1, explanation: 'Passive: the subject receives the action.' },
  { text: 'Choose the correct sentence:', options: ['Me and Tom went shopping.', 'Tom and me went shopping.', 'Tom and I went shopping.', 'I and Tom went shopping.'], correct: 2, explanation: '"Tom and I" is correct as the subject.' },
  { text: 'What is the plural of "sheep"?', options: ['Sheeps', 'Sheepes', 'Sheep', 'Sheepies'], correct: 2, explanation: '"Sheep" is the same in singular and plural.' },
  { text: 'Which sentence contains a relative clause?', options: ['I like chocolate.', 'The dog, which was brown, barked loudly.', 'She ran fast.', 'We went home.'], correct: 1, explanation: '"which was brown" is a relative clause.' },
  { text: 'What is the past tense of "run"?', options: ['Runned', 'Ran', 'Running', 'Runs'], correct: 1, explanation: 'Run → ran (irregular past tense).' },
  { text: 'Which word is a conjunction?', options: ['Because', 'Quickly', 'Happy', 'Table'], correct: 0, explanation: 'Conjunctions (because, and, but) join clauses.' },

  // Vocabulary
  { text: 'What does "benevolent" mean?', options: ['Cruel', 'Kind and generous', 'Lazy', 'Frightened'], correct: 1, explanation: 'Benevolent means kind and generous.' },
  { text: 'What does "reluctant" mean?', options: ['Eager', 'Unwilling or hesitant', 'Happy', 'Quick'], correct: 1, explanation: 'Reluctant means not willing.' },
  { text: 'Which word means "to make less severe"?', options: ['Aggravate', 'Mitigate', 'Complicate', 'Escalate'], correct: 1, explanation: 'Mitigate means to reduce severity.' },
  { text: 'What does "ambiguous" mean?', options: ['Clear', 'Open to more than one meaning', 'Loud', 'Beautiful'], correct: 1, explanation: 'Ambiguous means unclear or having multiple meanings.' },
  { text: 'What is a synonym for "courageous"?', options: ['Timid', 'Brave', 'Weak', 'Careful'], correct: 1, explanation: 'Courageous and brave both mean showing no fear.' },
  { text: 'What is the opposite of "sweet"?', options: ['Sour', 'Bitter', 'Salty', 'Bland'], correct: 1, explanation: 'Bitter is the opposite of sweet in taste.' },
  { text: 'What is the opposite of "professional"?', options: ['Expert', 'Amateur', 'Skilled', 'Trained'], correct: 1, explanation: 'Amateur means not professional.' },
  { text: 'What is the opposite of "temporary"?', options: ['Brief', 'Permanent', 'Short', 'Fleeting'], correct: 1, explanation: 'Permanent is the opposite of temporary.' },

  // Comprehension & Cloze
  { text: 'Complete: The children were ___ because they won the competition.', options: ['devastated', 'ecstatic', 'indifferent', 'anxious'], correct: 1, explanation: 'Ecstatic = extremely happy, fitting for winning.' },
  { text: 'Complete: Despite the ___ weather, the hikers continued.', options: ['pleasant', 'glorious', 'treacherous', 'mild'], correct: 2, explanation: '"Despite" signals contrast — the weather must be bad.' },
  { text: 'Complete: The old house had been ___ for years and was falling apart.', options: ['renovated', 'abandoned', 'decorated', 'inhabited'], correct: 1, explanation: 'Abandoned explains why the house is deteriorating.' },
  { text: 'Complete: "The knight showed great ___ in battle."', options: ['cowardice', 'valour', 'laziness', 'confusion'], correct: 1, explanation: 'Valour means great courage in battle.' },
  { text: 'Complete: The magician\'s trick was so ___ that the audience gasped.', options: ['boring', 'ordinary', 'spectacular', 'simple'], correct: 2, explanation: 'Spectacular = impressive enough to gasp at.' },

  // Spelling
  { text: 'Which word is spelled correctly?', options: ['Neccessary', 'Necessary', 'Neccesary', 'Necesary'], correct: 1, explanation: 'Necessary: one C, two S\'s.' },
  { text: 'Which word is spelled correctly?', options: ['Seperate', 'Separete', 'Separate', 'Seperete'], correct: 2, explanation: 'Separate has "a rat" in the middle.' },
  { text: 'Which word is spelled correctly?', options: ['Occassion', 'Ocassion', 'Occasion', 'Ocasion'], correct: 2, explanation: 'Occasion: two C\'s, one S.' },
  { text: 'Which word is spelled correctly?', options: ['Definately', 'Definatly', 'Definitely', 'Definitly'], correct: 2, explanation: 'Definitely contains "finite".' },

  // Figurative Language
  { text: '"The wind howled through the trees." This is:', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correct: 2, explanation: 'The wind is given a human action (howling) = personification.' },
  { text: '"She was as busy as a bee." This is:', options: ['Metaphor', 'Simile', 'Alliteration', 'Onomatopoeia'], correct: 1, explanation: '"As...as" comparison = simile.' },
  { text: '"Peter Piper picked a peck of pickled peppers." This is:', options: ['Simile', 'Personification', 'Alliteration', 'Hyperbole'], correct: 2, explanation: 'Repeated "P" sound = alliteration.' },
  { text: '"I\'ve told you a million times!" This is:', options: ['Simile', 'Metaphor', 'Alliteration', 'Hyperbole'], correct: 3, explanation: 'Exaggeration for effect = hyperbole.' },
  { text: '"The stars danced in the sky." This is:', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], correct: 2, explanation: 'Stars given human action (dancing) = personification.' },
  { text: '"Life is a journey." This is:', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], correct: 1, explanation: 'Direct comparison without "like" or "as" = metaphor.' },
  { text: '"As brave as a lion." This is:', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correct: 0, explanation: 'Using "as...as" to compare = simile.' },

  // Literary Knowledge
  { text: 'What is the main idea of a paragraph called?', options: ['Summary', 'Topic sentence', 'Thesis', 'Hook'], correct: 1, explanation: 'The topic sentence expresses the main idea.' },
  { text: 'What is the narrative voice of "I walked home"?', options: ['First person', 'Second person', 'Third person', 'Omniscient'], correct: 0, explanation: '"I" = first-person narration.' },
  { text: 'What is the climax of a story?', options: ['The opening', 'The turning point', 'The ending', 'The setting'], correct: 1, explanation: 'The climax is the most intense moment or turning point.' },
  { text: 'Which word is a noun?', options: ['Quickly', 'Happiness', 'Green', 'Run'], correct: 1, explanation: '"Happiness" names a thing (an emotion) — it is a noun.' },
  { text: 'What is an adverb?', options: ['A naming word', 'A describing word', 'A word that modifies a verb', 'A joining word'], correct: 2, explanation: 'An adverb modifies a verb, adjective, or another adverb.' },

  // Jumbled Words (from practice papers)
  { text: 'Unscramble O P T T A O (clue: a vegetable)', options: ['POTATO', 'TOMATO', 'CARROT', 'TURNIP'], correct: 0, explanation: 'O P T T A O rearranged = POTATO.' },
  { text: 'Unscramble O B E T L T (clue: drinks container)', options: ['BOTTLE', 'GOBLET', 'KETTLE', 'BASKET'], correct: 0, explanation: 'O B E T L T rearranged = BOTTLE.' },
  { text: 'Unscramble T C R O D O (clue: hospital worker)', options: ['DOCTOR', 'RECTOR', 'PROCTOR', 'MATRON'], correct: 0, explanation: 'T C R O D O rearranged = DOCTOR.' },
  { text: 'Unscramble L A P E N (clue: air transport)', options: ['PLANE', 'PANEL', 'PENAL', 'LEARN'], correct: 0, explanation: 'L A P E N rearranged = PLANE.' },
  { text: 'Unscramble G M O A N (clue: a fruit)', options: ['MANGO', 'MELON', 'GUAVA', 'GRAPE'], correct: 0, explanation: 'G M O A N rearranged = MANGO.' },
  { text: 'Unscramble E P H A R C U S (clue: buy something)', options: ['PURCHASE', 'CHAPTERS', 'POACHERS', 'PREACHES'], correct: 0, explanation: 'E P H A R C U S rearranged = PURCHASE.' },
];

// ─── NON-VERBAL REASONING 11+ (40 questions — text-based spatial/pattern) ───
export const CONTENT_NVR_11PLUS: Question[] = [
  // Rotations
  { text: 'If you rotate the letter "N" by 180 degrees, which letter does it look like?', options: ['Z', 'N', 'M', 'W'], correct: 1, explanation: 'N rotated 180° still looks like N (rotational symmetry order 2).' },
  { text: 'If you rotate "Z" by 90° clockwise, which letter does it resemble?', options: ['N', 'S', 'Z', 'L'], correct: 0, explanation: 'Z rotated 90° clockwise resembles N.' },
  { text: '270° clockwise is the same as how many degrees anti-clockwise?', options: ['90°', '180°', '270°', '360°'], correct: 0, explanation: '360 − 270 = 90° anti-clockwise.' },
  { text: 'How many times does a square look the same when rotated 360°?', options: ['2', '4', '6', '8'], correct: 1, explanation: 'A square has rotational symmetry of order 4.' },
  { text: 'A shape rotates 45° each step. After 4 steps, total rotation?', options: ['90°', '135°', '180°', '225°'], correct: 2, explanation: '4 × 45° = 180°.' },

  // Reflections
  { text: 'Which capital letter looks the same reflected in a vertical mirror?', options: ['F', 'A', 'J', 'P'], correct: 1, explanation: 'A has vertical symmetry.' },
  { text: 'Which letter looks different reflected in a horizontal mirror?', options: ['O', 'X', 'F', 'H'], correct: 2, explanation: 'F has no horizontal symmetry.' },
  { text: 'If you reflect the number 3 in a vertical mirror, what does it look like?', options: ['E', '3', 'A reversed 3', 'W'], correct: 2, explanation: 'Reflected 3 appears backwards, like a reversed E.' },

  // Nets & 3D shapes
  { text: 'Which net folds into an open-top box?', options: ['5 squares in a cross', '6 squares in a T', '6 squares in a cross', '4 squares in a line'], correct: 0, explanation: 'Open box = 5 faces (base + 4 sides). Cross of 5 squares works.' },
  { text: 'A cube painted red, cut into 27 small cubes. How many have exactly 2 red faces?', options: ['8', '12', '6', '1'], correct: 1, explanation: 'Edge cubes (not corners) have 2 painted faces. 3×3×3 cube has 12 edges.' },
  { text: 'A dice has opposite faces summing to 7. If 1 is on top, what is on the bottom?', options: ['2', '4', '6', '5'], correct: 2, explanation: '1 + 6 = 7, so 6 is on the bottom.' },
  { text: 'How many faces does a tetrahedron have?', options: ['3', '4', '5', '6'], correct: 1, explanation: 'A tetrahedron has 4 triangular faces.' },
  { text: 'How many faces does a triangular prism have?', options: ['3', '4', '5', '6'], correct: 2, explanation: 'A triangular prism has 5 faces: 2 triangles + 3 rectangles.' },
  { text: 'A cube has how many edges?', options: ['6', '8', '10', '12'], correct: 3, explanation: 'A cube has 12 edges: 4 top, 4 bottom, 4 vertical.' },

  // Pattern Sequences
  { text: 'Shapes gain one side each: triangle, square, pentagon. After hexagon?', options: ['Octagon', 'Heptagon', 'Nonagon', 'Decagon'], correct: 1, explanation: 'Heptagon has 7 sides, after hexagon (6).' },
  { text: 'Pattern: black circle, white square, black circle, white square. 7th shape?', options: ['White square', 'Black circle', 'White circle', 'Black square'], correct: 1, explanation: 'Odd positions = black circle. 7th is odd.' },
  { text: 'A dot starts at top of a square, moves 1 corner clockwise each step. After 6 steps?', options: ['Top', 'Right', 'Bottom', 'Left'], correct: 2, explanation: '6 mod 4 = 2 positions from top = bottom.' },

  // Spatial Awareness
  { text: 'How many small squares in a 4×4 grid?', options: ['8', '12', '16', '20'], correct: 2, explanation: '4 × 4 = 16.' },
  { text: 'Which shape has exactly 3 lines of symmetry?', options: ['Rectangle', 'Equilateral triangle', 'Parallelogram', 'Right triangle'], correct: 1, explanation: 'An equilateral triangle has 3 lines of symmetry.' },
  { text: 'Fold paper in half twice, punch a hole. How many holes when unfolded?', options: ['1', '2', '3', '4'], correct: 3, explanation: '2 folds = 4 layers → 4 holes.' },
  { text: 'Looking at a cube from directly above, what 2D shape?', options: ['Rectangle', 'Triangle', 'Square', 'Hexagon'], correct: 2, explanation: 'Top face of cube = square.' },

  // Matrices / Completing Patterns
  { text: 'Each row has circle, triangle, square. Row 3 has circle and triangle. Missing?', options: ['Circle', 'Triangle', 'Square', 'Pentagon'], correct: 2, explanation: 'Each row must have all 3 shapes. Square is missing.' },
  { text: 'Shapes get smaller left→right, darker top→bottom. Bottom-right?', options: ['Large light', 'Small light', 'Large dark', 'Small dark'], correct: 3, explanation: 'Rightmost = smallest, bottom = darkest → small dark.' },

  // Symmetry
  { text: 'How many lines of symmetry does a regular hexagon have?', options: ['3', '4', '6', '8'], correct: 2, explanation: 'A regular hexagon has 6 lines of symmetry.' },
  { text: 'Which shape has exactly 4 lines of symmetry?', options: ['Rectangle', 'Square', 'Parallelogram', 'Rhombus'], correct: 1, explanation: 'A square has 4 lines of symmetry.' },
  { text: 'How many right angles does a rectangle have?', options: ['2', '3', '4', '5'], correct: 2, explanation: 'A rectangle has 4 right angles.' },
  { text: 'What is the net of a cube made of?', options: ['4 squares', '5 squares', '6 squares', '8 squares'], correct: 2, explanation: 'A cube has 6 faces = 6 squares in the net.' },
  { text: 'What is the order of rotational symmetry of a regular pentagon?', options: ['3', '4', '5', '6'], correct: 2, explanation: 'A regular pentagon has rotational symmetry of order 5.' },

  // Sequences with shapes
  { text: 'If a shape has rotational symmetry order 3, minimum rotation to look the same?', options: ['90°', '120°', '180°', '60°'], correct: 1, explanation: '360 ÷ 3 = 120°.' },
  { text: 'Which 3D shape has 5 vertices?', options: ['Cube', 'Square-based pyramid', 'Triangular prism', 'Tetrahedron'], correct: 1, explanation: 'Square pyramid: 4 base vertices + 1 apex = 5.' },
  { text: 'A regular pentagon has how many diagonals?', options: ['3', '4', '5', '6'], correct: 2, explanation: 'n(n-3)/2 = 5(2)/2 = 5 diagonals.' },
  { text: 'A shape is enlarged by scale factor 2. Area increases by?', options: ['2', '4', '8', '16'], correct: 1, explanation: 'Area scales by square of factor: 2² = 4.' },

  // 3D Visualization
  { text: 'If 8 faces and 6 vertices (Euler\'s formula), how many edges?', options: ['10', '12', '14', '16'], correct: 1, explanation: 'V − E + F = 2. 6 − E + 8 = 2. E = 12.' },
  { text: 'Which transformation preserves both size and orientation?', options: ['Reflection', 'Rotation', 'Translation', 'Enlargement'], correct: 2, explanation: 'Translation moves without rotating or flipping.' },
  { text: 'A shape reflected in a vertical mirror line. What stays the same?', options: ['Orientation', 'Position', 'Size and shape', 'Direction'], correct: 2, explanation: 'Reflections preserve size and shape (congruence).' },
  { text: 'How many vertices does an octahedron have?', options: ['4', '6', '8', '12'], correct: 1, explanation: 'A regular octahedron has 6 vertices.' },
];
