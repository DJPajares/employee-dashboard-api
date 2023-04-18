_This is the back-end for the `employee dashboard` app_

## Requirements
- yarn
- node: 16.13.1 or above
- [postgresql](https://www.postgresql.org/)

## Procedure
- install the requirements above
- configure postgresql
    - [windows](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/)
    - [macos](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/)
- create a `.env` file in the root directory
    - add the `DATABASE_URL` value:
        - `DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>”`
        - sample: `DATABASE_URL="postgresql://postgres:pasword@localhost:5432/database?schema=public”`
- initiate prisma
    - run the ff commands:
        - `npx prisma generate`
        - `npx prisma db push`
- start app
    - `yarn start`
