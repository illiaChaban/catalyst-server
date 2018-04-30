
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
    description text,
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
        '1234',
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'user1',
        '1234'
    );

INSERT INTO users VALUES 
    (
        '1235',
        'https://www.templateplazza.com/templates/nutp/images/man.png',
        'user2',
        '1235'
    );