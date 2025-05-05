import React from 'react';
import { Report, UserCategory, UserRequest } from '@/backend/report_backend'; // Adjust path
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { formatDate } from '@/lib/utils'; // Adjust path
import { User, Mail, Phone, Calendar, CheckCircle, CircleOff, Clock, DollarSign, ListChecks, Trophy, Dumbbell, Activity, AlertCircle } from 'lucide-react';

interface UserReportDisplayProps {
  report: Report;
}

const SectionCard: React.FC<{ title: string, icon?: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <Card className="shadow-sm">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-semibold flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const DetailItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-2 text-sm py-1">
    <dt className="font-medium text-muted-foreground">{label}:</dt>
    <dd className="col-span-2">{value ?? <span className="text-xs italic text-muted-foreground">N/A</span>}</dd>
  </div>
);

const RequestStateBadge: React.FC<{ state: string }> = ({ state }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  let Icon = Clock;
  if (state === "APPROVED") { variant = "default"; Icon = CheckCircle; }
  else if (state === "REJECTED") { variant = "destructive"; Icon = CircleOff; }
  else if (state === "PENDING") { variant = "outline"; Icon = Clock; }

  return (
    <Badge variant={variant} className="capitalize text-xs">
      <Icon className="mr-1 h-3 w-3" />
      {state.toLowerCase()}
    </Badge>
  );
};


const UserReportDisplay: React.FC<UserReportDisplayProps> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* --- Personal Information --- */}
      <SectionCard title="Personal Information" icon={<User className="h-5 w-5" />}>
        <dl className="space-y-1">
          <DetailItem label="Full Name" value={report.full_name} />
          <DetailItem label="Email" value={report.email} />
          <DetailItem label="Phone" value={report.phone_number} />
          <DetailItem label="Birth Date" value={formatDate(report.birth_date, 'PPP')} />
          <DetailItem label="Registered On" value={formatDate(report.registration_date, 'PPP')} />
        </dl>
      </SectionCard>

      {/* --- Categories --- */}
      <SectionCard title="Registered Categories" icon={<ListChecks className="h-5 w-5" />}>
        {report.categories && report.categories.length > 0 ? (
          <ul className="space-y-2">
            {report.categories.map((cat, index) => (
              <li key={index} className="text-sm p-2 border rounded bg-muted/50">
                <span className='font-medium'>{cat.category_name}:</span> <Badge variant="secondary">{cat.user_level}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No categories registered.</p>
        )}
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-6">
        {/* --- Training Summary --- */}
        <SectionCard title="Training Summary" icon={<Dumbbell className="h-5 w-5" />}>
          <dl className="space-y-1">
            <DetailItem label="Total Registrations" value={report.training_summary?.total_registrations} />
            <DetailItem label="Total Attendances" value={report.training_summary?.total_attendances} />
            <DetailItem label="Last Attended" value={formatDate(report.training_summary?.most_recent_attendance)} />
          </dl>
        </SectionCard>

        {/* --- Tournament Summary --- */}
        <SectionCard title="Tournament Summary" icon={<Trophy className="h-5 w-5" />}>
          <dl className="space-y-1">
            <DetailItem label="Total Registrations" value={report.tournament_summary?.total_registrations} />
            <DetailItem label="Total Attendances" value={report.tournament_summary?.total_attendances} />
            <DetailItem label="Last Registered" value={formatDate(report.tournament_summary?.most_recent_registration)} />
            <DetailItem label="Last Attended" value={formatDate(report.tournament_summary?.most_recent_attendance)} />
          </dl>
        </SectionCard>
      </div>


      {/* --- Tuition Summary --- */}
      <SectionCard title="Tuition Summary" icon={<DollarSign className="h-5 w-5" />}>
        <dl className="space-y-1">
          <DetailItem label="Total Payments Made" value={report.tuition_summary?.total_payments} />
          <DetailItem label="Last Payment Date" value={formatDate(report.tuition_summary?.last_payment_date)} />
          <DetailItem label="Last Payment Amount" value={report.tuition_summary?.last_payment_amount ? `$${report.tuition_summary.last_payment_amount.toFixed(2)}` : 'N/A'} />
          <DetailItem label="Days Until Next Due" value={report.tuition_summary?.days_until_next_payment ?? 'N/A'} />
        </dl>
      </SectionCard>

      {/* --- Requests --- */}
      <SectionCard title="User Requests" icon={<Activity className="h-5 w-5" />}>
        {report.requests && report.requests.length > 0 ? (
          <Table>
            <TableCaption>Recent requests made by the user.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Command</TableHead>
                <TableHead className='text-right'>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.requests.map((req) => (
                <TableRow key={req.request_id}>
                  <TableCell className='font-mono text-xs'>{req.request_id}</TableCell>
                  <TableCell>{req.requested_command}</TableCell>
                  <TableCell className='text-right'><RequestStateBadge state={req.state} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No requests found for this user.</p>
        )}
      </SectionCard>

    </div>
  );
};

export default UserReportDisplay;
