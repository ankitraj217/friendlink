-- Datebase setup script for FriendLink application
USE friendlink_db;

-- Users
INSERT INTO users (id, name, avatar, email, password, email_verified) VALUES
('u1','Ankit Raj','https://ui-avatars.com/api/?name=Ankit+Raj&background=random','ankit1@mail.com','$2b$10$n.mpr1em/pBDCq5eHAyNT.FsIGD7Rc7qSxV7jfJm.VMKuF01fPrWC',1),
('u2','Rohit Sharma','https://ui-avatars.com/api/?name=Rohit+Sharma&background=random','rohit@mail.com','hashed_pass',1),
('u3','Neha Verma','https://ui-avatars.com/api/?name=Neha+Verma&background=random','neha@mail.com','hashed_pass',1),
('u4','Aman Gupta','https://ui-avatars.com/api/?name=Aman+Gupta&background=random','aman@mail.com','hashed_pass',1),
('u5','Priya Singh','https://ui-avatars.com/api/?name=Priya+Singh&background=random','priya@mail.com','hashed_pass',1),
('u6','Rahul Mehta','https://ui-avatars.com/api/?name=Rahul+Mehta&background=random','rahul@mail.com','hashed_pass',1),
('u7','Simran Kaur','https://ui-avatars.com/api/?name=Simran+Kaur&background=random','simran@mail.com','hashed_pass',1),
('u8','Kunal Jain','https://ui-avatars.com/api/?name=Kunal+Jain&background=random','kunal@mail.com','hashed_pass',1),
('u9','Pooja Patel','https://ui-avatars.com/api/?name=Pooja+Patel&background=random','pooja@mail.com','hashed_pass',1),
('u10','Arjun Malhotra','https://ui-avatars.com/api/?name=Arjun+Malhotra&background=random','arjun@mail.com','hashed_pass',1),
('u11','Sneha Iyer','https://ui-avatars.com/api/?name=Sneha+Iyer&background=random','sneha@mail.com','hashed_pass',1),
('u12','Vikas Yadav','https://ui-avatars.com/api/?name=Vikas+Yadav&background=random','vikas@mail.com','hashed_pass',1),
('u13','Riya Choudhary','https://ui-avatars.com/api/?name=Riya+Choudhary&background=random','riya@mail.com','hashed_pass',1),
('u14','Mohit Bansal','https://ui-avatars.com/api/?name=Mohit+Bansal&background=random','mohit@mail.com','hashed_pass',1),
('u15','Aditi Joshi','https://ui-avatars.com/api/?name=Aditi+Joshi&background=random','aditi@mail.com','hashed_pass',1),
('u16','Saurabh Singh','https://ui-avatars.com/api/?name=Saurabh+Singh&background=random','saurabh@mail.com','hashed_pass',1),
('u17','Nisha Kapoor','https://ui-avatars.com/api/?name=Nisha+Kapoor&background=random','nisha@mail.com','hashed_pass',1),
('u18','Yash Arora','https://ui-avatars.com/api/?name=Yash+Arora&background=random','yash@mail.com','hashed_pass',1),
('u19','Kavya Nair','https://ui-avatars.com/api/?name=Kavya+Nair&background=random','kavya@mail.com','hashed_pass',1),
('u20','Deepak Rana','https://ui-avatars.com/api/?name=Deepak+Rana&background=random','deepak@mail.com','hashed_pass',1);

-- Profiles
INSERT INTO profiles (user_id, username, bio, verified) VALUES
('u1','ankitraj','Full-stack developer',1),
('u2','rohit','Fitness enthusiast',0),
('u3','neha','Love travelling',1),
('u4','aman','Startup founder',0),
('u5','priya','Digital marketer',1),
('u6','rahul','Tech blogger',0),
('u7','simran','UI/UX designer',1),
('u8','kunal','Finance analyst',0),
('u9','pooja','Content creator',1),
('u10','arjun','Photographer',0),
('u11','sneha','HR professional',1),
('u12','vikas','Operations manager',0),
('u13','riya','MBA student',1),
('u14','mohit','Sales consultant',0),
('u15','aditi','Brand strategist',1),
('u16','saurabh','Backend engineer',0),
('u17','nisha','Interior designer',1),
('u18','yash','Video editor',0),
('u19','kavya','Data analyst',1),
('u20','deepak','Entrepreneur',0);

-- Friends
INSERT INTO friends (user1_id, user2_id, status) VALUES
('u1','u2',1),('u1','u3',1),('u1','u4',1),
('u2','u3',0),('u2','u5',1),
('u3','u6',1),('u4','u5',1),
('u6','u7',1),('u8','u9',1),
('u10','u11',1),('u12','u13',0),
('u14','u15',1),('u16','u17',1),
('u18','u19',1),('u19','u20',0);

-- Posts
INSERT INTO posts (user_id, media_url, caption, location) VALUES
('u1','https://picsum.photos/seed/post1/600/600','Working on FriendLink 🚀','Bangalore'),
('u2','https://picsum.photos/seed/post2/600/600','Morning workout 💪','Mumbai'),
('u3','https://picsum.photos/seed/post3/600/600','Travel diaries ✈️','Goa'),
('u4','https://picsum.photos/seed/post4/600/600','Startup grind','Delhi'),
('u5','https://picsum.photos/seed/post5/600/600','Marketing wins','Pune'),
('u6','https://picsum.photos/seed/post6/600/600','New blog live','Remote'),
('u7','https://picsum.photos/seed/post7/600/600','Design inspiration','Remote'),
('u8','https://picsum.photos/seed/post8/600/600','Stock market vibes','Mumbai'),
('u9','https://picsum.photos/seed/post9/600/600','Content creation day','Ahmedabad'),
('u10','https://picsum.photos/seed/post10/600/600','Photography love','Jaipur'),

('u1','https://picsum.photos/seed/post11/600/600','Debugging night','Remote'),
('u2','https://picsum.photos/seed/post12/600/600','Leg day','Gym'),
('u3','https://picsum.photos/seed/post13/600/600','Beach sunset','Goa'),
('u4','https://picsum.photos/seed/post14/600/600','Pitch meeting','Delhi'),
('u5','https://picsum.photos/seed/post15/600/600','Ad campaign launch','Mumbai'),

('u6','https://picsum.photos/seed/post16/600/600','API design','Remote'),
('u7','https://picsum.photos/seed/post17/600/600','Figma magic','Remote'),
('u8','https://picsum.photos/seed/post18/600/600','Finance tips','LinkedIn'),
('u9','https://picsum.photos/seed/post19/600/600','Reels shooting','Studio'),
('u10','https://picsum.photos/seed/post20/600/600','Golden hour','Udaipur'),

('u11','https://picsum.photos/seed/post21/600/600','Team hiring','Office'),
('u12','https://picsum.photos/seed/post22/600/600','Process optimization','Office'),
('u13','https://picsum.photos/seed/post23/600/600','MBA grind','Campus'),
('u14','https://picsum.photos/seed/post24/600/600','Sales funnel','Office'),
('u15','https://picsum.photos/seed/post25/600/600','Brand revamp','Remote'),

('u16','https://picsum.photos/seed/post26/600/600','Node.js life','Remote'),
('u17','https://picsum.photos/seed/post27/600/600','Interior sketch','Studio'),
('u18','https://picsum.photos/seed/post28/600/600','Video editing','Studio'),
('u19','https://picsum.photos/seed/post29/600/600','Data dashboards','Remote'),
('u20','https://picsum.photos/seed/post30/600/600','Startup mindset','Remote'),

('u1','https://picsum.photos/seed/post31/600/600','Late night coding','Remote'),
('u2','https://picsum.photos/seed/post32/600/600','Healthy food','Home'),
('u3','https://picsum.photos/seed/post33/600/600','Mountain trip','Manali'),
('u4','https://picsum.photos/seed/post34/600/600','Investor call','Office'),
('u5','https://picsum.photos/seed/post35/600/600','Client meeting','Cafe'),

('u6','https://picsum.photos/seed/post36/600/600','Tech trends','Twitter'),
('u7','https://picsum.photos/seed/post37/600/600','UI practice','Remote'),
('u8','https://picsum.photos/seed/post38/600/600','Market watch','Bloomberg'),
('u9','https://picsum.photos/seed/post39/600/600','Creative mood','Studio'),
('u10','https://picsum.photos/seed/post40/600/600','Street photography','Delhi');

-- Likes
INSERT INTO likes (user_id, post_id) VALUES
('u2',1),('u3',1),('u4',1),
('u1',2),('u3',2),
('u5',3),('u6',3),
('u7',4),('u8',4),
('u9',5),('u10',5);

-- Comments
INSERT INTO comments (post_id, user_id, comment) VALUES
(1,'u2','Amazing work!'),
(1,'u3','Looks great 🔥'),
(2,'u1','Stay fit!'),
(3,'u4','Nice view'),
(4,'u5','All the best 🚀');
