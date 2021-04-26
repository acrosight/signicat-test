from flask import Blueprint, render_template, request
import signicat_test

views = Blueprint('views', __name__)

@views.route('/', methods=['GET','POST'])
def home():
    is_authenticated = False
    # Checking if authenticate button is pressed
    if request.form.get('authenticate'):
        # setting a global so that we can use it later
        global _id
        # Setting is_authenticated to true so that we can se the display user button
        is_authenticated = True
        # fetching the session id
        _id = signicat_test.get_id()
        print(_id)
        
    # Checking if display user button is pressed 
    elif request.form.get('display'):
        # Fetching identity from given session id
        identity = signicat_test.get_session(_id)
        # Returning a new html that displays the user identity
        return render_template('/userData.html',firstname=identity['firstName'], lastname=identity['lastName'], date=identity['dateOfBirth'])
    
    return render_template('home.html', boolean=is_authenticated)
