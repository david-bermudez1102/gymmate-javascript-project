class Account < ApplicationRecord
  validates :name, presence: :true, format: { with: /\A[a-zA-Z]+\Z/ }
  validates :lastname, presence: :true, format: { with: /\A[a-zA-Z]+\Z/ }
  validates :username, length: { minimum: 6 }, format: { with: /\A[a-zA-Z0-9-_.]+\Z/, message:"can't have any spaces or special characters, except for dashes or dots" }, uniqueness: true
  validates :email, format: {:with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i}, uniqueness: {message:"already belongs to an existing account"}
  validates :password, presence: true, length: { in: 6..50 }, format: { without: /\s/ }, :on => :create
  
  validates :sex, :inclusion => {:in => [0,1,2]}
  validates :date_of_birth, :presence => true


  belongs_to :userable, polymorphic: true
  has_many :pictures
  has_many :videos
  has_many :likes
  has_attached_file :profile_picture
  validates_attachment :profile_picture, {
            :styles => { :large => "700x400#", :medium=>"490x368#", :thumbnail=>"75x75#" },
            :default_url => "/images/thumbnail/blank-recipe.png" } 
  do_not_validate_attachment_file_type :profile_picture

  has_secure_password

  def generate_auth_token
    token = SecureRandom.hex
    self.update_columns(auth_token: token)
    token
  end

  def invalidate_auth_token
    self.update_columns(auth_token: nil)
  end

  def self.search(query)
    where('name LIKE ? OR lastname LIKE ?', "%#{query}%", "%#{query}%")
  end
end
