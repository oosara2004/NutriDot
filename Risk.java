import java.util.ArrayList;
import java.util.List;

// Ticket class
class Ticket {
    private String type;
    private double fare;

    public Ticket(String type, double fare) {
        this.type = type;
        this.fare = fare;
    }

    public double getFare() {
        return fare;
    }

    public String getType() {
        return type;
    }
}

// PaymentGateway interface
interface PaymentGateway {
    boolean processPayment(double amount);
}

// Primary payment gateway
class PrimaryPaymentGateway implements PaymentGateway {
    @Override
    public boolean processPayment(double amount) {
        return Math.random() > 0.2; // 80% success rate
    }
}

// Backup payment gateway
class BackupPaymentGateway implements PaymentGateway {
    @Override
    public boolean processPayment(double amount) {
        return Math.random() > 0.5; // 50% success rate
    }
}

// TicketingSystem class
class TicketingSystem {
    private List<PaymentGateway> paymentGateways = new ArrayList<>();

    public TicketingSystem() {
        paymentGateways.add(new PrimaryPaymentGateway());
        paymentGateways.add(new BackupPaymentGateway());
    }

    public void purchaseTicket(Ticket ticket) {
        if (ticket.getFare() <= 0) {
            System.out.println("Error: Invalid fare for " + ticket.getType() + " ticket.");
            return;
        }

        System.out.println("Attempting to purchase " + ticket.getType() + " ticket for " + ticket.getFare() + " SR");
        for (PaymentGateway gateway : paymentGateways) {
            if (gateway.processPayment(ticket.getFare())) {
                System.out.println("Payment successful via " + gateway.getClass().getSimpleName());
                return;
            } else {
                System.out.println("Payment failed via " + gateway.getClass().getSimpleName());
            }
        }

        System.out.println("All payment gateways failed. Please try again later.");
    }
}

// Main class
public class Risk {
    public static void main(String[] args) {
        TicketingSystem ticketingSystem = new TicketingSystem();
        
        // Create tickets
        Ticket firstClassTicket = new Ticket("First Class (3 days)", 50.00);
        Ticket regularTicket = new Ticket("Regular (3 days)", 20.00);
        
        // Attempt to purchase tickets
        ticketingSystem.purchaseTicket(firstClassTicket);
        ticketingSystem.purchaseTicket(regularTicket);
        
        // Test with an invalid fare
        Ticket invalidTicket = new Ticket("Invalid Ticket", -10.00);
        ticketingSystem.purchaseTicket(invalidTicket);
    }
}