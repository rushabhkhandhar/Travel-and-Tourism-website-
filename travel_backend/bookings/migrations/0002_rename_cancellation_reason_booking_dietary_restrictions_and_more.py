# Generated by Django 4.2 on 2025-06-12 06:15

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('destinations', '0001_initial'),
        ('bookings', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='booking',
            old_name='cancellation_reason',
            new_name='dietary_restrictions',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='travel_date',
            new_name='end_date',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='special_requests',
            new_name='special_requirements',
        ),
        migrations.RenameField(
            model_name='booking',
            old_name='price_per_person',
            new_name='total_price',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='cancelled_at',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='cancelled_by',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='currency',
        ),
        migrations.RemoveField(
            model_name='booking',
            name='total_amount',
        ),
        migrations.RemoveField(
            model_name='bookingtraveler',
            name='dietary_requirements',
        ),
        migrations.RemoveField(
            model_name='bookingtraveler',
            name='email',
        ),
        migrations.RemoveField(
            model_name='bookingtraveler',
            name='phone_number',
        ),
        migrations.AddField(
            model_name='booking',
            name='primary_contact_email',
            field=models.EmailField(default='default@example.com', max_length=254),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='primary_contact_name',
            field=models.CharField(default='Default Contact', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='primary_contact_phone',
            field=models.CharField(default='0000000000', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='booking',
            name='start_date',
            field=models.DateField(default=datetime.date(2025, 6, 12)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bookingtraveler',
            name='departure_date',
            field=models.DateField(default=datetime.date(2025, 6, 12)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bookingtraveler',
            name='destination',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='destinations.destination'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bookingtraveler',
            name='nationality',
            field=models.CharField(default='US', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bookingtraveler',
            name='number_of_travelers',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bookingtraveler',
            name='return_date',
            field=models.DateField(default=datetime.date(2025, 6, 12)),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='booking',
            name='booking_id',
            field=models.CharField(editable=False, max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='booking',
            name='number_of_travelers',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='booking',
            name='payment_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded')], default='pending', max_length=20),
        ),
        migrations.AlterField(
            model_name='bookingtraveler',
            name='date_of_birth',
            field=models.DateField(default=datetime.date(2025, 6, 12)),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='bookingtraveler',
            name='first_name',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='bookingtraveler',
            name='last_name',
            field=models.CharField(max_length=50),
        ),
        migrations.DeleteModel(
            name='Payment',
        ),
    ]
