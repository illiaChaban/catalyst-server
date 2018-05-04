
CREATE TABLE users (
    avatar text,
    username text,
    email text,
    passw text,
    userid SERIAL UNIQUE
);

CREATE TABLE friends (
    userid SERIAL,
    friendsarray text
);

CREATE TABLE goals (  
    userid SERIAL,
    goalname text,
    description text,
    deadline DATE,
    created DATE,
    punishment text,
    goalid SERIAL UNIQUE    
);

CREATE TABLE checkins (
    goalid SERIAL,
    image text,
    description text,
    created DATE
);

CREATE TABLE comments (
    goalid SERIAL,
    userid SERIAL,
    created DATE,
    comment text
);

INSERT INTO users VALUES 
    (
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'Illia',
        'illia@gmail.com',
        '$2b$10$3AooIvGRUKgfjRZLOLV3i.Kb/6ZmOfFA58MLrwkp33swUEKDlNiA2'
    );

INSERT INTO users VALUES 
    (
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'Aaron',
        'aaron@gmail.com',
        '$2b$10$3AooIvGRUKgfjRZLOLV3i.Kb/6ZmOfFA58MLrwkp33swUEKDlNiA2'
    );

INSERT INTO users VALUES 
    (
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'Itzik',
        'itzik@gmail.com',
        '$2b$10$3AooIvGRUKgfjRZLOLV3i.Kb/6ZmOfFA58MLrwkp33swUEKDlNiA2'
    );


INSERT INTO friends VALUES
    (
        '1',
        '["2", "3"]'
    );

INSERT INTO friends VALUES
    (
        '2',
        '["3"]'
    );

INSERT INTO friends VALUES
    (
        '3',
        '["1"]'
    );

INSERT INTO goals VALUES
    (
        '1',
        'Squat 300lbs',
        'Being able to ATG squat 300lbs per rep',
        '2018-06-01',
        '2018-04-01',
        'Run around the block naked'
    );

INSERT INTO goals VALUES
    (
        '1',
        'Learn to dance',
        'Go to a club and dance like a beast!',
        '2018-07-05',
        '2018-05-01',
        'Wash Aarons car'
    );

INSERT INTO goals VALUES
    (
        '2',
        'Start having a normal lunch',
        'Not a chocolate milk',
        '2018-05-03',
        '2018-04-30',
        'Buy sushi for everyone'
    );

INSERT INTO goals VALUES
    (
        '3',
        'Make Aaron drink chocolate milk for lunch',
        'So that he would have to buy sushi for everyone',
        '2018-05-02',
        '2018-05-01',
        'Drink only chocolate milk for lunch for an entire week'
    );

INSERT INTO checkins VALUES
    (
        '1',
        '',
        'Squated 250lbs ATG',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '1',
        '',
        'Squated 240lbs ATG',
        '2018-04-21'
    );

INSERT INTO checkins VALUES
    (
        '1',
        '',
        'Squated 220lbs ATG',
        '2018-04-05'
    );

INSERT INTO checkins VALUES
    (
        '2',
        '',
        'Aaron noticed that I move very good',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '3',
        '',
        'I forgot my chocolate milk at home :(',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '3',
        '',
        'It doesnt count today, I was stressed out',
        '2018-04-30'
    );

INSERT INTO checkins VALUES
    (
        '4',
        '',
        'Bought a chocolate milk for Aaron',
        '2018-05-01'
    );

INSERT INTO comments VALUES
    (
        '1',
        '2',
        '2018-04-25',
        'I could never squat so much, I envy you'
    );

INSERT INTO comments VALUES
    (
        '1',
        '3',
        '2018-04-15',
        'Bro, my 8 year old sister squats more than you!'
    );

INSERT INTO comments VALUES
    (
        '4',
        '1',
        '2018-05-01',
        'Keep it up, Itzik'
    );

INSERT INTO comments VALUES
    (
        '3',
        '3',
        '2018-05-01',
        'Want some chocolate milk, Aaron?'
    );