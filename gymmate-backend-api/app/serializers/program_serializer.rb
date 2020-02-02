class ProgramSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :video
  has_many :exercises
  attributes :views, :created_at, :updated_at, :message

  def message
    "success"
  end

end
