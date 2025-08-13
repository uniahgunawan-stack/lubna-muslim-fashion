import Image from 'next/image'


export function LoginGoogleButton(){
  return (
    <button className='flex items-center justify-center gap-2 w-full text-black
    font-medium py-2 px-6 text-base rounded-sm shadow hover:bg-[#ff8248] hover:text-white cursor-pointer'>
        <Image 
        src='./google-icon.svg'
        alt='Google Icon'
        width={20}
        height={20}
        priority={true}
        className='h-8 w-8'/>
        Sign In Whit Google
    </button>
  )
}

