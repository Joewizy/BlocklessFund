import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Image } from "lucide-react"

const Hero = () => {
  return (
    <section className="hero-gradient py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Decentralized crowdfunding with <span className="text-fundngn-green">cNGN</span> on{" "}
              <span className="text-fundngn-green">Base</span>.
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Support projects, build communities, and shape the future of Nigeria.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="bg-fundngn-green text-white hover:bg-fundngn-darkgreen px-5 py-2 h-auto" asChild>
                <Link to="/campaigns" className="flex items-center">
                  Explore Campaigns
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-fundngn-green text-fundngn-green hover:bg-fundngn-green hover:text-white px-5 py-2 h-auto"
                asChild
              >
                <Link to="/create-campaign">Start a Campaign</Link>
              </Button>
              <Button
                variant="outline"
                className="border-fundngn-green text-fundngn-green hover:bg-fundngn-green hover:text-white px-5 py-2 h-auto"
                asChild
              >
                <Link to="/proposal">View Proposals</Link>
              </Button>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((user) => (
                  <div key={user} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=32&width=32&text=User${user}`}
                      alt={`User ${user}`}
                      width={32}
                      height={32}
                      className="bg-fundngn-lightgreen"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">250+ campaigns funded</span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-fundngn-gold opacity-10 rounded-full blur-2xl animate-float"></div>
            <div
              className="absolute -bottom-12 -right-12 w-40 h-40 bg-fundngn-green opacity-10 rounded-full blur-2xl animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-100 card-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">FundNGN Platform</h3>
                <div className="bg-fundngn-green/10 text-fundngn-green text-xs px-3 py-1 rounded-full font-medium">
                  Growing 15% month over month
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold">Total Value Locked</h2>
                <p className="text-4xl font-bold text-fundngn-green mt-1">25.5M cNGN</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Campaigns</p>
                  <p className="font-bold text-xl">250+</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Success Rate</p>
                  <p className="font-bold text-xl">87%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
