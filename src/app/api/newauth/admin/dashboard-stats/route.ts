import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { role } = verifyToken(token);
        if (role !== "admin" && role !== "superadmin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // 1. Agent Statistics
        const agentsStatsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE role = 'agent') as total_agents,
        COUNT(*) FILTER (WHERE role = 'agent' AND is_suspended = false) as active_agents,
        COUNT(*) FILTER (WHERE role = 'agent' AND is_suspended = true) as suspended_agents
      FROM users
    `;

        // 2. Today's Appointments
        const todayAppointmentsQuery = `
      SELECT COUNT(*) as today_count 
      FROM appointments 
      WHERE appointment_date = CURRENT_DATE
    `;

        // 3. Refund Requests (assuming status 'cancelled' with refund_eligible as a proxy or if you have a refunds table)
        const refundRequestsQuery = `
      SELECT COUNT(*) as refund_count 
      FROM appointments 
      WHERE status = 'cancelled' AND refund_eligible = true
    `;

        // 4. Recent Activity (Showing Bookings and Cancellations)
        const recentActivityQuery = `
      SELECT 
        a.id,
        u.name as agent_name,
        a.patient_name,
        CASE 
          WHEN a.status = 'confirmed' THEN 'Booked Appointment'
          WHEN a.status = 'cancelled' THEN 'Cancelled Appointment'
          WHEN a.status = 'completed' THEN 'Completed Appointment'
          ELSE 'Updated Appointment'
        END as action,
        a.updated_at AT TIME ZONE 'UTC' as timestamp
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.updated_at DESC
      LIMIT 10
    `;

        const [agentsRes, todayAppRes, refundsRes, activityRes] = await Promise.all([
            pool.query(agentsStatsQuery),
            pool.query(todayAppointmentsQuery),
            pool.query(refundRequestsQuery),
            pool.query(recentActivityQuery),
        ]);

        const stats = {
            totalAgents: parseInt(agentsRes.rows[0].total_agents) || 0,
            activeAgents: parseInt(agentsRes.rows[0].active_agents) || 0,
            suspendedAgents: parseInt(agentsRes.rows[0].suspended_agents) || 0,
            todayAppointments: parseInt(todayAppRes.rows[0].today_count) || 0,
            refundRequests: parseInt(refundsRes.rows[0].refund_count) || 0,
            recentActivity: activityRes.rows.map((row) => ({
                id: row.id,
                agentName: row.agent_name,
                patientName: row.patient_name,
                action: row.action,
                timestamp: row.timestamp,
            })),
        };

        return NextResponse.json(stats, { status: 200 });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}