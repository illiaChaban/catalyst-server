
CREATE TABLE users (
    avatar text,
    username text,
    email text,
    passw text,
    userid SERIAL UNIQUE
);

CREATE TABLE friends (
    userid text NOT NULL,
    friendsarray text
);

CREATE TABLE goals (  
    userid text NOT NULL,
    goalname text,
    description text,
    deadline DATE,
    created DATE,
    punishment text,
    goalid SERIAL UNIQUE    
);

CREATE TABLE checkins (
    goalid text NOT NULL,
    image text,
    description text,
    created DATE
);

CREATE TABLE comments (
    goalid text NOT NULL,
    userid text NOT NULL,
    created DATE,
    comment text
);

INSERT INTO users VALUES 
    (
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'illia',
        'illia@gmail.com',
        '1111'
    );

INSERT INTO users VALUES 
    (
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'aaron',
        'aaron@gmail.com',
        '1111'
    );

INSERT INTO users VALUES 
    (
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'itzik',
        'itzik@gmail.com',
        '1111'
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
        'squat 300 lb',
        'being able to ATG squat 300 lb per rep',
        '2018-06-01',
        '2018-04-01',
        'run around the block naked'
    );

INSERT INTO goals VALUES
    (
        '1',
        'learn to dance',
        'go to club and dance like a beast',
        '2018-07-05',
        '2018-05-01',
        'wash aarons car'
    );

INSERT INTO goals VALUES
    (
        '2',
        'start having a normal lunch',
        'not a chocolate milk',
        '2018-05-03',
        '2018-04-30',
        'buy sushi for everyone'
    );

INSERT INTO goals VALUES
    (
        '3',
        'make aaron drink chocolate milk for a lunch',
        'so that he would buy sushi for everyone',
        '2018-05-02',
        '2018-05-01',
        'drink chocolate milk for lunch for a week'
    );

INSERT INTO checkins VALUES
    (
        '1',
        '',
        'squated 250 lb ATG',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '1',
        '',
        'squated 240 lb ATG',
        '2018-04-21'
    );

INSERT INTO checkins VALUES
    (
        '1',
        '',
        'squated 220 lb ATG',
        '2018-04-05'
    );

INSERT INTO checkins VALUES
    (
        '2',
        '',
        'aaron noticed that I move very good',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '3',
        '',
        'i forgot my chocolate milk at home',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '3',
        '',
        'it doesnt count today, I was stressed out',
        '2018-04-30'
    );

INSERT INTO checkins VALUES
    (
        '4',
        '',
        'bought a chocolate milk for aaron',
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
        'bro, my 8 y. o. sister squats more than you'
    );

INSERT INTO comments VALUES
    (
        '4',
        '1',
        '2018-05-01',
        'keep it up, itzik'
    );

INSERT INTO comments VALUES
    (
        '3',
        '3',
        '2018-05-01',
        'want some chocolate milk, aaron?'
    );