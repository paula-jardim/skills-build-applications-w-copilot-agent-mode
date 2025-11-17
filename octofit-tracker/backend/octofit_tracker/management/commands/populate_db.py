from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from octofit_tracker import models as app_models

from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Conectar ao MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Limpar coleções
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Criar times
        marvel_team = {'name': 'Team Marvel'}
        dc_team = {'name': 'Team DC'}
        marvel_team_id = db.teams.insert_one(marvel_team).inserted_id
        dc_team_id = db.teams.insert_one(dc_team).inserted_id

        # Criar usuários
        users = [
            {'name': 'Tony Stark', 'email': 'tony@marvel.com', 'team_id': marvel_team_id},
            {'name': 'Steve Rogers', 'email': 'steve@marvel.com', 'team_id': marvel_team_id},
            {'name': 'Bruce Wayne', 'email': 'bruce@dc.com', 'team_id': dc_team_id},
            {'name': 'Clark Kent', 'email': 'clark@dc.com', 'team_id': dc_team_id},
        ]
        db.users.insert_many(users)

        # Criar atividades
        activities = [
            {'user_email': 'tony@marvel.com', 'activity': 'Running', 'duration': 30},
            {'user_email': 'steve@marvel.com', 'activity': 'Cycling', 'duration': 45},
            {'user_email': 'bruce@dc.com', 'activity': 'Swimming', 'duration': 60},
            {'user_email': 'clark@dc.com', 'activity': 'Flying', 'duration': 120},
        ]
        db.activities.insert_many(activities)

        # Criar leaderboard
        leaderboard = [
            {'user_email': 'tony@marvel.com', 'points': 100},
            {'user_email': 'steve@marvel.com', 'points': 90},
            {'user_email': 'bruce@dc.com', 'points': 110},
            {'user_email': 'clark@dc.com', 'points': 120},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Criar workouts
        workouts = [
            {'user_email': 'tony@marvel.com', 'workout': 'Chest Day'},
            {'user_email': 'steve@marvel.com', 'workout': 'Leg Day'},
            {'user_email': 'bruce@dc.com', 'workout': 'Back Day'},
            {'user_email': 'clark@dc.com', 'workout': 'Full Body'},
        ]
        db.workouts.insert_many(workouts)

        # Criar índice único para email
        db.users.create_index([('email', 1)], unique=True)

        self.stdout.write(self.style.SUCCESS('octofit_db populado com dados de teste!'))
