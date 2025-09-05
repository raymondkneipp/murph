import { createFileRoute, Link } from "@tanstack/react-router";
import {
	PlayIcon,
	StarIcon,
	TimerIcon,
	TrophyIcon,
	UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/_marketing/")({
	component: App,
});

function App() {
	return (
		<>
			<section className="bg-muted py-32">
				<div className="flex flex-col items-center gap-4 container">
					<Badge>Honor the Hero WOD</Badge>
					<h1 className="uppercase font-bold text-7xl md:text-8xl text-center">
						Murph
					</h1>
					<h2 className="text-lg md:text-2xl text-center text-balance">
						Train with the legendary workout that honors Lt. Michael Murphy.
						Push your limits, track your progress, and compete with warriors
						worldwide.
					</h2>

					<div className="flex flex-wrap items-center justify-center gap-4">
						<Button asChild size="lg">
							<Link to="/login">
								<PlayIcon />
								Start Your Murph
							</Link>
						</Button>

						<Button asChild size="lg" variant="outline">
							<Link to="/leaderboard">
								<TrophyIcon />
								View Leaderboard
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 md:gap-8 max-w-screen-lg mt-8">
						{[
							{ title: "1 Mile", description: "Opening Run" },
							{ title: "100", description: "Pull-ups" },
							{ title: "200", description: "Push-ups" },
							{ title: "300", description: "Squats" },
						].map((item) => (
							<Card className="py-4" key={item.title}>
								<CardHeader className="text-center">
									<CardTitle className="text-2xl md:text-3xl">
										{item.title}
									</CardTitle>
									<CardDescription>{item.description}</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
					<p className="col-span-full text-center text-sm">
						Finish with another 1-mile run
					</p>
				</div>
			</section>

			<section className="py-32 container flex flex-col gap-16">
				<div className="flex flex-col gap-4 items-center">
					<h2 className="font-bold text-3xl md:text-5xl text-center text-balance">
						Train Like a Hero
					</h2>
					<p className="text-lg md:text-xl text-center text-balance max-w-screen-lg">
						Our app guides you through every rep, tracks your progress, and
						connects you with a community of dedicated athletes.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
					{[
						{
							icon: TimerIcon,
							title: "Guided Workouts",
							description:
								"Step-by-step guidance through the Murph workout with built-in timers, rep counters, and rest periods to keep you on track.",
						},
						{
							icon: TrophyIcon,
							title: "Monthly Leaderboards",
							description:
								"Compete with athletes worldwide on our monthly leaderboards. Track your personal records and see how you stack up.",
						},
						{
							icon: UsersRound,
							title: "Community Support",
							description:
								"Join a community of dedicated athletes. Share your achievements, get motivated, and honor the memory of Lt. Michael Murphy together.",
						},
					].map((item) => (
						<Card key={item.title}>
							<CardHeader className="text-center flex flex-col items-center">
								<div className="bg-primary text-primary-foreground p-4 rounded-full mb-2">
									<item.icon />
								</div>
								<CardTitle className="text-xl md:text-2xl">
									{item.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-center text-pretty">{item.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="py-32 bg-secondary">
				<div className="container">
					<div className="grid lg:grid-cols-2 gap-x-32 gap-y-8">
						<div className="flex flex-col gap-4">
							<Badge variant="outline">Memorial Day Tradition</Badge>
							<h2 className="font-bold text-3xl md:text-5xl text-balance">
								Honor Lt. Michael Murphy
							</h2>
							<p className="sm:text-lg text-pretty">
								The Murph workout is named after Navy Lieutenant Michael Murphy,
								who was killed in Afghanistan on June 28, 2005. This Hero WOD
								has become a Memorial Day tradition, honoring his sacrifice and
								the sacrifices of all fallen service members.
							</p>
							<p className="sm:text-lg text-pretty">
								Lt. Murphy was known for his physical fitness and dedication.
								This workout represents the kind of training that made him and
								his fellow SEALs the elite warriors they were.
							</p>
							<Button asChild variant="link" className="w-min px-0">
								<a
									href="https://en.wikipedia.org/wiki/Michael_P._Murphy"
									target="_blank"
								>
									Learn More About Lt. Murphy
								</a>
							</Button>
						</div>

						<div className="rounded-4xl overflow-hidden">
							<img
								src="/military-memorial-flag.png"
								className="object-cover size-full"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="py-32 container flex flex-col items-center gap-4">
				<h2 className="font-bold text-3xl md:text-5xl text-balance text-center">
					Warriors Speak
				</h2>
				<h3 className="text-lg sm:text-xl text-pretty text-center max-w-lg">
					Hear from athletes who've conquered the Murph and found their
					strength.
				</h3>

				<div className="grid lg:grid-cols-3 gap-4 md:gap-8 mt-4">
					{[
						{
							quote:
								"This app pushed me to complete my first Murph in under 45 minutes. The community support and tracking features kept me motivated every step of the way.",
							name: "Sarah M.",
							title: "CrossFit Athlete",
						},
						{
							quote:
								"As a veteran, doing Murph means everything to me. This app helps me honor my fallen brothers while staying in the best shape of my life.",
							name: "Mike R.",
							title: "Army Veteran",
						},
						{
							quote:
								"The leaderboard feature is incredible. Seeing my progress month over month and competing with others keeps me coming back for more.",
							name: "Alex T.",
							title: "Fitness Enthusiast",
						},
					].map((testimonial) => (
						<Card key={testimonial.name}>
							<CardContent className="flex flex-col gap-4">
								<div className="flex gap-0.5">
									{Array.from({ length: 5 }).map((_, i) => (
										<StarIcon
											key={i}
											className="fill-primary text-primary size-5"
										/>
									))}
								</div>

								<figure className="flex flex-col gap-4">
									<blockquote className="text-lg italic text-muted-foreground text-pretty">
										“{testimonial.quote}”
									</blockquote>
									<figcaption>
										<span className="font-semibold">{testimonial.name}</span>
										<span className="block text-sm text-muted-foreground">
											{testimonial.title}
										</span>
									</figcaption>
								</figure>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="py-32 bg-accent">
				<div className="container flex flex-col items-center gap-4">
					<h2 className="font-bold text-3xl md:text-5xl text-balance text-center">
						Ready to Honor the Hero?
					</h2>
					<h3 className="text-lg sm:text-xl text-pretty text-center max-w-screen-md">
						Join thousands of athletes who train with purpose. Sign up for the
						Murph Workout App and start your journey today.
					</h3>

					<div className="flex flex-wrap items-center justify-center gap-4 mt-4">
						<Button asChild size="lg">
							<Link to="/login">
								<PlayIcon />
								Start Your Murph
							</Link>
						</Button>

						<Button asChild size="lg" variant="secondary">
							<Link to="/leaderboard">
								<TrophyIcon />
								View Leaderboard
							</Link>
						</Button>
					</div>

					<p className="text-center text-pretty text-sm mt-4">
						<q>Courage, Honor, Commitment, Dedication</q> - Lt. Michael Murphy
					</p>
				</div>
			</section>
		</>
	);
}
