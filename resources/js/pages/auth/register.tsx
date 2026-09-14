import { Form, Head } from '@inertiajs/react';
import { CalendarIcon, Info } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import type { TeamInvitationContext } from '@/types';

type Props = {
    passwordRules: string;
    teamInvitation?: TeamInvitationContext | null;
};

function toDateOfBirthValue(date: Date): string {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

function fromDateOfBirthValue(value: string): Date | undefined {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return undefined;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
        ? date
        : undefined;
}

function formatDateOfBirth(value: string): string {
    const date = fromDateOfBirthValue(value);

    return date
        ? [
              String(date.getDate()).padStart(2, '0'),
              String(date.getMonth() + 1).padStart(2, '0'),
              date.getFullYear(),
          ].join('/')
        : 'DD / MM / YYYY';
}

export default function Register({ passwordRules, teamInvitation }: Props) {
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [ageInformationOpen, setAgeInformationOpen] = useState(false);
    const today = new Date();
    const maximumDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const selectedDate = fromDateOfBirthValue(dateOfBirth);

    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {teamInvitation && (
                            <TeamInvitationAlert
                                invitation={teamInvitation}
                                action="Register"
                            />
                        )}

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center gap-1">
                                    <Label id="date_of_birth-label">
                                        Date of birth
                                    </Label>
                                    <Popover
                                        open={ageInformationOpen}
                                        onOpenChange={setAgeInformationOpen}
                                    >
                                        <PopoverAnchor asChild>
                                            <button
                                                type="button"
                                                aria-label="About the age requirement"
                                                aria-controls="age-requirement-info"
                                                aria-expanded={
                                                    ageInformationOpen
                                                }
                                                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background -my-1 inline-flex size-10 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                                onFocus={() =>
                                                    setAgeInformationOpen(true)
                                                }
                                                onBlur={() =>
                                                    setAgeInformationOpen(false)
                                                }
                                                onMouseEnter={() =>
                                                    setAgeInformationOpen(true)
                                                }
                                                onClick={() =>
                                                    setAgeInformationOpen(true)
                                                }
                                            >
                                                <Info className="size-4" />
                                            </button>
                                        </PopoverAnchor>
                                        <PopoverContent
                                            id="age-requirement-info"
                                            aria-label="Age requirement"
                                            align="start"
                                            className="w-64 space-y-1.5"
                                        >
                                            <p className="text-sm font-semibold">
                                                18+ only
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                VYRA is for adults aged 18 and
                                                over.
                                            </p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <input
                                    type="hidden"
                                    name="date_of_birth"
                                    value={dateOfBirth}
                                />
                                <Popover
                                    open={datePickerOpen}
                                    onOpenChange={setDatePickerOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            tabIndex={3}
                                            aria-labelledby="date_of_birth-label"
                                            aria-required="true"
                                            aria-invalid={Boolean(
                                                errors.date_of_birth,
                                            )}
                                            aria-describedby={
                                                errors.date_of_birth
                                                    ? 'date_of_birth-error'
                                                    : undefined
                                            }
                                            className="h-11 w-full justify-between rounded-xl px-3.5 text-left font-normal"
                                        >
                                            <span
                                                className={
                                                    dateOfBirth
                                                        ? undefined
                                                        : 'text-muted-foreground'
                                                }
                                            >
                                                {formatDateOfBirth(dateOfBirth)}
                                            </span>
                                            <CalendarIcon className="text-muted-foreground size-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="start"
                                        className="w-auto border-0 bg-transparent p-0 shadow-none"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                if (!date) {
                                                    return;
                                                }

                                                setDateOfBirth(
                                                    toDateOfBirthValue(date),
                                                );
                                                setDatePickerOpen(false);
                                            }}
                                            disabled={{ after: maximumDate }}
                                            captionLayout="dropdown"
                                            reverseYears
                                            startMonth={new Date(1900, 0)}
                                            endMonth={maximumDate}
                                            defaultMonth={
                                                selectedDate ?? maximumDate
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                                <InputError
                                    id="date_of_birth-error"
                                    message={errors.date_of_birth}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Already have an account?{' '}
                            <TextLink
                                href={
                                    teamInvitation
                                        ? login.url({
                                              query: {
                                                  invitation:
                                                      teamInvitation.code,
                                              },
                                          })
                                        : login()
                                }
                                data-test="team-invitation-login-link"
                                tabIndex={7}
                            >
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
