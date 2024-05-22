[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6IebC48C)

---

## Running the App

After `git clone`-ing, first get the Django development server running:

```bash
cd dough_divider_server

# The next 4 installation comamnds may not be necessary
# Also, the equivalent commands may be slightly different on a different machine
pip3 install --upgrade pip
pip3 install -r requirements.txt

python3 manage.py runserver
```

If the `pip3 install -r requirements.txt` step above fails, try running the following instead:

```
pip3 install ariadne ariadne-django broadcaster channels daphne Django django-cors-headers djangorestframework starlette
```

Confirm that the server is correctly up and running by visiting the [http://127.0.0.1:8000/graphql/](http://127.0.0.1:8000/graphql/) endpoint, where you should see a GraphQL playground. If not, and you get a missing dependencies error, this can likely be solved with `pip3 install (missing dependency name)`.

Once this is up and running, then run the frontend client:

```bash
cd ../dough_divider_client
npm install
npm start
```

At this point, you should see the [http://localhost:3000/](http://localhost:3000/) page display a login screen. To conduct a transaction between more than one user, open another instance of the client in a separate terminal (which will likely direct you to run on a different port, which is fine).

## Design Doc

Link: [https://docs.google.com/document/d/1Kh-pN4Y-vzHUEAcCv6u7fg7xmtZVKqH0Ds60LmUIMsY/edit?usp=sharing](https://docs.google.com/document/d/1Kh-pN4Y-vzHUEAcCv6u7fg7xmtZVKqH0Ds60LmUIMsY/edit?usp=sharing)

## Presentation Slides

Link: [https://docs.google.com/presentation/d/1cy7qvlNnpacb6drIH9XSXWq6ZwFzGrFTvzWOR4QmOPo/edit?usp=sharing](https://docs.google.com/presentation/d/1cy7qvlNnpacb6drIH9XSXWq6ZwFzGrFTvzWOR4QmOPo/edit?usp=sharing)
