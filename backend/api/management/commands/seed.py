from django.core.management.base import BaseCommand
from api.models.user import Admin, Barber, Client
from api.models.appointment import Service, Appointment, AppointmentService, Availability, Review, AppointmentStatus
from datetime import date, timedelta, time
import random


class Command(BaseCommand):
    help = "Seed database with initial data"

    def handle(self, *args, **kwargs):
        self.stdout.write("🔥 Criando dados...")

        # -----------------------
        # ADMIN
        # -----------------------
        Admin.objects.get_or_create(
            username="admin",
            defaults={"password": "Admin@123"}
        )

        # -----------------------
        # BARBERS (MAIS VARIADOS)
        # -----------------------
        barbers = []
        barber_data = [
            ("joao", "João", "Silva"),
            ("carlos", "Carlos", "Souza"),
            ("pedro", "Pedro", "Lima"),
            ("marcos", "Marcos", "Oliveira"),
            ("lucas", "Lucas", "Ferreira"),
            ("rafael", "Rafael", "Almeida"),
        ]

        for username, name, surname in barber_data:
            barber, created = Barber.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@teste.com",
                    "name": name,
                    "surname": surname,
                }
            )
            if created:
                barber.set_password("12345678")
                barber.save()
            barbers.append(barber)

        self.stdout.write("✅ Barbeiros criados")

        # -----------------------
        # CLIENTS
        # -----------------------
        clients = []

        # clientes normais
        for i in range(8):
            username = f"cliente{i}"
            client, created = Client.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@teste.com",
                    "name": f"Cliente{i}",
                    "surname": "Teste",
                }
            )
            if created:
                client.set_password("12345678")
                client.save()
            clients.append(client)

        # 🔥 CLIENTE SEM AGENDAMENTO (IMPORTANTE)
        test_user, created = Client.objects.get_or_create(
            username="teste",
            defaults={
                "email": "teste@teste.com",
                "name": "Usuario",
                "surname": "Teste",
            }
        )
        if created:
            test_user.set_password("12345678")
            test_user.save()

        self.stdout.write("✅ Clientes criados")

        # -----------------------
        # SERVICES
        # -----------------------
        for barber in barbers:
            for name, price in [
                ("Corte", 30),
                ("Barba", 20),
                ("Corte + Barba", 45),
                ("Pigmentação", 25),
            ]:
                Service.objects.get_or_create(
                    barber=barber,
                    name=name,
                    defaults={"price": price}
                )

        self.stdout.write("✅ Serviços criados")

        # -----------------------
        # AVAILABILITY
        # -----------------------
        for barber in barbers:
            for i in range(7):
                day = date.today() + timedelta(days=i)
                Availability.objects.get_or_create(
                    barber=barber,
                    date=day,
                    defaults={
                        "slots": ["09:00", "10:00", "11:00", "14:00", "15:00"]
                    }
                )

        self.stdout.write("✅ Disponibilidade criada")

        # -----------------------
        # APPOINTMENTS
        # -----------------------
        used_client_date = set()
        used_barber_slot = set()

        created_count = 0

        while created_count < 15:
            client = random.choice(clients)  # NÃO inclui o "teste"
            barber = random.choice(barbers)

            day = date.today() + timedelta(days=random.randint(0, 6))
            slot_str = random.choice(["09:00", "10:00", "11:00", "14:00"])
            slot_time = time(int(slot_str.split(":")[0]), 0)

            if (client.id, day) in used_client_date:
                continue

            if (barber.id, day, slot_time) in used_barber_slot:
                continue

            used_client_date.add((client.id, day))
            used_barber_slot.add((barber.id, day, slot_time))

            appointment = Appointment.objects.create(
                client=client,
                barber=barber,
                date=day,
                slot=slot_time,
                status=random.choice([
                    AppointmentStatus.ONGOING.value,
                    AppointmentStatus.COMPLETED.value
                ])
            )

            services = Service.objects.filter(barber=barber)

            for service in random.sample(list(services), k=2):
                AppointmentService.objects.create(
                    appointment=appointment,
                    original_service=service,
                    name=service.name,
                    price=service.price
                )

            created_count += 1

        self.stdout.write("✅ Agendamentos criados")

        # -----------------------
        # REVIEWS
        # -----------------------
        for client in clients:
            for barber in barbers:
                if random.random() > 0.5:
                    Review.objects.get_or_create(
                        client=client,
                        barber=barber,
                        defaults={
                            "rating": random.randint(3, 5),
                            "comment": "Ótimo serviço!"
                        }
                    )

        self.stdout.write("✅ Reviews criadas")

        self.stdout.write(self.style.SUCCESS("🔥 Seed finalizada com sucesso!"))