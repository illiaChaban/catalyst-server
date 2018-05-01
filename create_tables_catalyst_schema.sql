
CREATE TABLE users (
    userid text NOT NULL UNIQUE,
    avatar text,
    username text,
    jwtpassword text
);

CREATE TABLE friends (
    userid text NOT NULL,
    friendsarray text
);

CREATE TABLE goals (
    userid text NOT NULL,
    goalid text NOT NULL UNIQUE,
    goalname text,
    descrip text,
    deadline DATE,
    created DATE,
    punishment text    
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
        '1111',
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'illia',
        '1111'
    );

INSERT INTO users VALUES 
    (
        '1112',
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'aaron',
        '1111'
    );

INSERT INTO users VALUES 
    (
        '1113',
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'itzik',
        '1111'
    );


INSERT INTO friends VALUES
    (
        '1111',
        '["1112", "1113"]'
    );

INSERT INTO friends VALUES
    (
        '1112',
        '["1113"]'
    );

INSERT INTO friends VALUES
    (
        '1113',
        '["1111"]'
    );

INSERT INTO goals VALUES
    (
        '1111',
        '2222',
        'squat 300 lb',
        'being able to ATG squat 300 lb per rep',
        '2018-06-01',
        '2018-04-01',
        'run around the block naked'
    );

INSERT INTO goals VALUES
    (
        '1111',
        '2223',
        'learn to dance',
        'go to club and dance like a beast',
        '2018-07-05',
        '2018-05-01',
        'wash aarons car'
    );

INSERT INTO goals VALUES
    (
        '1112',
        '2224',
        'start having a normal lunch',
        'not a chocolate milk',
        '2018-05-03',
        '2018-04-30',
        'buy sushi for everyone'
    );

INSERT INTO goals VALUES
    (
        '1113',
        '2225',
        'make aaron drink chocolate milk for a lunch',
        'so that he would buy sushi for everyone',
        '2018-05-02',
        '2018-05-01',
        'drink chocolate milk for lunch for a week'
    );

INSERT INTO checkins VALUES
    (
        '2222',
        '',
        'squated 250 lb ATG',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '2222',
        '',
        'squated 240 lb ATG',
        '2018-04-21'
    );

INSERT INTO checkins VALUES
    (
        '2222',
        '',
        'squated 220 lb ATG',
        '2018-04-05'
    );

INSERT INTO checkins VALUES
    (
        '2223',
        '',
        'aaron noticed that I move very good',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '2224',
        '',
        'i forgot my chocolate milk at home',
        '2018-05-01'
    );

INSERT INTO checkins VALUES
    (
        '2224',
        '',
        'it doesnt count today, I was stressed out',
        '2018-04-30'
    );

INSERT INTO checkins VALUES
    (
        '2225',
        '',
        'bought a chocolate milk for aaron',
        '2018-05-01'
    );

INSERT INTO comments VALUES
    (
        '2222',
        '1112',
        '2018-04-25',
        'I could never squat so much, I envy you'
    );

INSERT INTO comments VALUES
    (
        '2222',
        '1113',
        '2018-04-15',
        'bro, my 8 y. o. sister squats more than you'
    );

INSERT INTO comments VALUES
    (
        '2225',
        '1111',
        '2018-05-01',
        'keep it up, itzik'
    );

INSERT INTO comments VALUES
    (
        '2224',
        '1113',
        '2018-05-01',
        'want some chocolate milk, aaron?'
    );